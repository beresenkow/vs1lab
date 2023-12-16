// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

import { LocationHelper } from './location-helper.js';
import { MapManager } from "./map-manager.js";

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

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});