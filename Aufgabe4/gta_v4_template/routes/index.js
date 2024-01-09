// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const InMemoryGeoTagStore = require('../models/geotag-store');
const store = new InMemoryGeoTagStore();

const GeoTagExamples = require('../models/geotag-examples');
const examples = new GeoTagExamples();
var currentPage;
const paginationLimit = 5;

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  const { latitude, longitude } = req.query;
  const newTaglist = GeoTagExamples.populateStore(store);
  store.generateFreshIds();
  res.render('index', { taglist: newTaglist, latitude, longitude });
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * Based on the form data, a new geotag is created and stored.
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

router.post('/tagging', (req, res) => {
  const { name, latitude_tagging, longitude_tagging, hashtag } = req.body;

  const latitude = parseFloat(latitude_tagging);
  const longitude = parseFloat(longitude_tagging);


  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag);
  store.addGeoTag(newGeoTag);
  store.generateFreshIds();
  const taggingResult = store.getNearbyGeoTags(latitude, longitude, 30);

  res.render('index', { taglist: taggingResult, latitude: latitude, longitude: longitude });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.

 * This includes coordinates and an optional search term.
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

router.post('/discovery', (req, res) => {
  const { latitude_discovery, longitude_discovery, searchterm } = req.body;

  const latitude = parseFloat(latitude_discovery);
  const longitude = parseFloat(longitude_discovery);

  var discoverGeoTags = store.searchNearbyGeoTags(latitude, longitude, 30, searchterm);

  res.render('index', { taglist: discoverGeoTags, latitude: latitude, longitude: longitude });
});

module.exports = router;

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...

router.get('/api/geotags', (req, res) => {
  const { latitude_discovery, longitude_discovery, searchterm } = req.query;

  var filteredGeoTags = store.getAllGeoTags();

  console.log(searchterm, latitude_discovery, longitude_discovery);
  if (searchterm && searchterm !== "") {
    filteredGeoTags = filteredGeoTags.filter(
      geoTag => geoTag.name.includes(searchterm) || (geoTag.hashtag && geoTag.hashtag.includes(searchterm))
    );
    res.json(filteredGeoTags);
    return;
  }

  if (latitude_discovery && longitude_discovery) {
    const latitude = parseFloat(latitude_discovery);
    const longitude = parseFloat(longitude_discovery);

    filteredGeoTags = filteredGeoTags.filter(
      geoTag => store.dist(latitude, longitude, geoTag.latitude, geoTag.longitude) <= 30
    );
    res.json(filteredGeoTags);
    return;
  }
  res.json(filteredGeoTags);
});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...

router.post('/api/geotags', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;

  // Validation for name
  if (!name || !/^[A-Z][a-zA-Z\s]*$/.test(name)) {
    res.status(400).json({ error: "Invalid 'name' input. It must start with a capital letter and contain only letters." });
    return;
  }

  // Validation for hashtag
  if (hashtag && !/^#/.test(hashtag)) {
    res.status(400).json({ error: "Invalid 'hashtag' input. If not empty, it should start with '#'." });
    return;
  }

  const newGeoTag = new GeoTag(name, parseFloat(latitude), parseFloat(longitude), hashtag);
  store.addGeoTag(newGeoTag);
  store.generateFreshIds();

  var paginatedGeoTags = []
  paginatedGeoTags = paginateGeoTags(store.getAllGeoTags(), currentPage, paginationLimit);

  res.append('location', "/api/geotags/" + newGeoTag.id);
  res.status(201).json(JSON.stringify(paginatedGeoTags));
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...

router.get('/api/geotags/:id', (req, res) => {
  console.log("Transfered Id: " + req.params.id);

  if (Number.isInteger(parseInt(req.params.id))) {
    // if the id-parameter is an Integer, it means that the page
    // was changed.
    console.log("Transfered ID is actually an ID.");
    currentPage = req.params.id;
    const geoTag = JSON.stringify(paginateGeoTags(store.getAllGeoTags(), currentPage, paginationLimit));

    if (geoTag) {
      res.json(geoTag);
    } else {
      res.status(404).send();
    }
  }
  else {
    // But if the id-parameter is not an Integer, the id will be
    // The Searchterm from the Discovery-Field, and we will search
    // for an array of GeoTags, that match the searchterm.
    console.log("Transfered ID is actually a searchterm.");
    const searchTerm = req.params.id;
    var geotags = [];
    geotags.push(store.getGeoTagsBySearchterm(searchTerm));
    const paginatedGeoTags = paginateGeoTags(geotags, 1, paginationLimit);
    console.log("Found GeoTags by Searchterm: " + JSON.stringify(paginatedGeoTags));

    if (paginatedGeoTags) {
      res.json(JSON.stringify(paginatedGeoTags));
    } else {
      res.status(404).send();
    }
  }
});

function paginateGeoTags(geotags, page, pageSize) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  var geotagsCopy = new Array(geotags.length);
  geotags.forEach((item, index) => {
    if (index >= startIndex && index < endIndex) {
      geotagsCopy[index] = item;
    } else {
      geotagsCopy[index] = undefined;
    }
  });
  console.log(geotagsCopy);
  return geotagsCopy;
}

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...

router.put('/api/geotags/:id', (req, res) => {
  const geoTagId = req.params.id;
  const { name, latitude, longitude, hashtag } = req.body;

  // Validation for name
  if (!name || !/^[A-Z][a-zA-Z\s]*$/.test(name)) {
    res.status(400).json({ error: "Invalid 'name' input. It must start with a capital letter and contain only letters." });
    return;
  }

  // Validation for hashtag
  if (hashtag && !/^#/.test(hashtag)) {
    res.status(400).json({ error: "Invalid 'hashtag' input. If not empty, it should start with '#'." });
    return;
  }

  const updatedGeoTag = store.updateGeoTag(parseInt(geoTagId), name, parseFloat(latitude), parseFloat(longitude), hashtag);

  if (updatedGeoTag) {
    res.json(updatedGeoTag);
  } else {
    res.status(404).json({ error: 'GeoTag not found' });
  }
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...

router.delete('/api/geotags/:id', (req, res) => {
  const geoTagId = req.params.id;
  const deletedGeoTag = store.deleteGeoTag(parseInt(geoTagId));
  store.generateFreshIds();
  if (deletedGeoTag) {
    res.json(deletedGeoTag);
  } else {
    res.status(404).json({ error: 'GeoTag not found' });
  }
});

module.exports = router;


// cd Aufgabe4/gta_4_template
// npm start