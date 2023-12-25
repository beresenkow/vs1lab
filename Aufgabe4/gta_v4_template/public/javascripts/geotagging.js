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

// Function to handle tagging form submission using AJAX
function handleTaggingButton(event) {
    event.preventDefault(); // Prevent the default form submission

    const taggingForm = document.getElementById("taggingForm");
    const formData = new FormData(taggingForm);

    // Create GeoTag object using the server-side GeoTag constructor
    const geoTag = {
        latitude_tagging: formData.get("latitude_tagging"),
        longitude_tagging: formData.get("longitude_tagging"),
        name: formData.get("name"),
        hashtag: formData.get("hashtag"),
    };

    // Use Fetch API to send POST request with JSON payload
    fetch('http://localhost:3000/api/geotags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(geoTag),
    })
    .then(response => response.json())
    .then(data => {
        // Handle response data as needed
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to handle discovery form submission using AJAX
function handleDiscoveryButton(event) {
    event.preventDefault(); // Prevent the default form submission

    const discoveryForm = document.getElementById("discoveryForm");
    const formData = new FormData(discoveryForm);

    // Use Fetch API to send GET request with query parameters
    const queryParams = new URLSearchParams(formData);
    fetch(`http://localhost:3000/api/geotags/${queryParams.toString()}`)
    .then(response => response.json())
    .then(data => {
        // Handle response data as needed
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

taggingButton.addEventListener("submit", handleTaggingButton);
discoveryButton.addEventListener("submit", handleDiscoveryButton);


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation);