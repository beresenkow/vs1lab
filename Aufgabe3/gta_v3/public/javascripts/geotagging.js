// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

function updateLocation() {
    var locationHelper = new LocationHelper();

    locationHelper.findLocation(function(helper) {
        var taggingLatitudeInput = document.getElementById("latitude_tagging");
        var taggingLongitudeInput = document.getElementById("longitude_tagging");
        var discoveryLatitudeInput = document.getElementById("latitude_discovery");
        var discoveryLongitudeInput = document.getElementById("longitude_discovery");

        taggingLatitudeInput.value = helper.latitude;
        taggingLongitudeInput.value = helper.longitude;

        discoveryLatitudeInput.value = helper.latitude;
        discoveryLongitudeInput.value = helper.longitude;

        console.log("Current location lat: " + helper.latitude + ", long: " + helper.longitude);

        var mapManager = new MapManager("FtWHGJMvdole3bKfpGDmCaVTIfY24EJj");
        var mapImage = document.getElementById("mapView");
        mapImage.src = mapManager.getMapUrl(helper.latitude, helper.longitude, [], 17);
    });
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});