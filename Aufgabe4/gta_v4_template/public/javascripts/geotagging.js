// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

import { LocationHelper } from './location-helper.js';
import { MapManager } from "./map-manager.js";

const taggingButton = document.getElementById("addTagButton");
const discoveryButton = document.getElementById("discoveryButton");

function updateLocation() {
    // function that updates the users location.
    var taggingLatitudeInput = document.getElementById("latitude_tagging");
    var taggingLongitudeInput = document.getElementById("longitude_tagging");
    var discoveryLatitudeInput = document.getElementById("latitude_discovery");
    var discoveryLongitudeInput = document.getElementById("longitude_discovery");

    var valuesExist = taggingLatitudeInput.value && taggingLongitudeInput.value &&
                      discoveryLatitudeInput.value && discoveryLongitudeInput.value; 

    if (!valuesExist) {
        // Executes the LocationHelper only when it is required.
        LocationHelper.findLocation(function(helper) {
            taggingLatitudeInput.value = helper.latitude;
            taggingLongitudeInput.value = helper.longitude;
    
            discoveryLatitudeInput.value = helper.latitude;
            discoveryLongitudeInput.value = helper.longitude;
            
            drawMap(helper.latitude, helper.longitude);

            console.log("Current location lat: " + helper.latitude + ", long: " + helper.longitude);
        });
    } else {
        drawMap(taggingLatitudeInput.value, taggingLongitudeInput.value);

        console.log("findLocation skipped.");
    } 
}

function drawMap(latitude, longitude) {
    // Generates a new Map-Image.
    var mapManager = new MapManager("FtWHGJMvdole3bKfpGDmCaVTIfY24EJj");
    var mapImage = document.getElementById("mapView");
    const tagsJson = mapImage.getAttribute('data-taglist');
    const tags = JSON.parse(tagsJson);

    mapImage.src = mapManager.getMapUrl(latitude, longitude, tags, 17);
}

function drawMapWithGeotags(geotags) {
    console.log("Geotags got at Map: " + JSON.parse(geotags));
    var mapManager = new MapManager("FtWHGJMvdole3bKfpGDmCaVTIfY24EJj");
    var mapImage = document.getElementById("mapView");

    var latitude = parseFloat(document.getElementById("latitude_tagging").value);
    var longitude = parseFloat(document.getElementById("longitude_tagging").value);

    mapImage.src = mapManager.getMapUrl(latitude, longitude,JSON.parse(geotags), 17);
    return geotags;
}

function updateList(geotags) {
    console.log(geotags)
    var list = JSON.parse(geotags);

    var ul = document.getElementById("discoveryResults");
    ul.innerHTML = "";
    list. forEach(function (gtag) {
        var li = document.createElement("li");
        li.innerHTML = gtag.name + " (" + gtag.latitude + " ," + gtag.longitude + ") " + gtag.hashtag;
        li.classList.add("geoTagElement");
        ul.appendChild(li);
    })
    document.getElementById("name").value = "";
    document.getElementById("hashtag").value = "";

    return parseInt(document.getElementById("discoveryResults").innerHTML);
}

// async function for the Tagging EventListener
async function tagging(geotag){
    var response = await fetch("http://localhost:3000/api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(geotag),
    });

    console.log(response);
    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData;
    //return await response.json();
}

// async function for the Discovery EventListener
async function discovery(searchInput){
    var response = await fetch("http://localhost:3000/api/geotags/" + searchInput,{
        method: "GET",
        headers: {"Content-Type": "application/json"}
    });

    console.log(response);
    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData;
    //return await response.json();
}

// EventListener for the Tagging Submit Button
taggingButton.addEventListener("click", function (event) {
    event.preventDefault();// blocks default event handling

    var geotag = {
        name: document.getElementById("name").value,
        latitude: document.getElementById("latitude_tagging").value,
        longitude: document.getElementById("longitude_tagging").value,
        hashtag: document.getElementById("hashtag").value
    }

    console.log("Following GeoTag added:");
    console.log("Name: " + document.getElementById("name").value);
    console.log("Lati: " + document.getElementById("latitude_tagging").value);
    console.log("Long: " + document.getElementById("longitude_tagging").value);
    console.log("Hash: " + document.getElementById("hashtag").value);

    tagging(geotag).then(drawMapWithGeotags).then(updateList);
});

// EventListener for the Discovery Submit Button
discoveryButton.addEventListener("click", function (event) {
    event.preventDefault();

    var searchTerm = document.getElementById("searchterm").value;
    console.log("Trying to search for GeoTags that match the keyWord: " + searchTerm);

    discovery(searchTerm).then(drawMapWithGeotags).then(updateList)//.catch(error => alert("The entered Search Term does not match with any GeoTags"));
});

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation);