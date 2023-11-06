// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * A class to help using the HTML5 Geolocation API.
 */
class LocationHelper {
    // Location values for latitude and longitude are private properties to protect them from changes.
    #latitude = '';

    /**
     * Getter method allows read access to privat location property.
     */
    get latitude() {
        return this.#latitude;
    }

    #longitude = '';

    get longitude() {
        return this.#longitude;
    }

    /**
     * The 'findLocation' method requests the current location details through the geolocation API.
     * It is a static method that should be used to obtain an instance of LocationHelper.
     * Throws an exception if the geolocation API is not available.
     * @param {*} callback a function that will be called with a LocationHelper instance as parameter, that has the current location details
     */
    static findLocation(callback) {
        const geoLocationApi = navigator.geolocation;

        if (!geoLocationApi) {
            throw new Error("The GeoLocation API is unavailable.");
        }

        // Call to the HTML5 geolocation API.
        // Takes a first callback function as argument that is called in case of success.
        // Second callback is optional for handling errors.
        // These callbacks are given as arrow function expressions.
        geoLocationApi.getCurrentPosition((location) => {
            // Create and initialize LocationHelper object.
            let helper = new LocationHelper();
            helper.#latitude = location.coords.latitude.toFixed(5);
            helper.#longitude = location.coords.longitude.toFixed(5);
            // Pass the locationHelper object to the callback.
            callback(helper);
        }, (error) => {
            alert(error.message)
        });
    }
}

/**
 * A class to help using the MapQuest map service.
 */
class MapManager {
    /*
     * MapQuest Zugangsdaten:
     * E-Mail: vs1lab@existiert.net
     * Code: ms_144e7fec4e6d165ba5f3c4668689e7ad74002074@existiert.net
     * Username: vs1lab_mapquest
     * Company: vs1lab
     * Name: vs1
     * Lastname: lab
     * Password: 9T$.2aA2D;Hb~!^
     * 
     * Consumer Key: FtWHGJMvdole3bKfpGDmCaVTIfY24EJj
     */

    #apiKey = '';

    /**
     * Create a new MapManager instance.
     * @param {string} apiKey Your MapQuest API Key
     */
    constructor(apiKey) {
        this.#apiKey = apiKey;
    }

    /**
     * Generate a MapQuest image URL for the specified parameters.
     * @param {number} latitude The map center latitude
     * @param {number} longitude The map center longitude
     * @param {{latitude, longitude, name}[]} tags The map tags, defaults to just the current location
     * @param {number} zoom The map zoom, defaults to 10
     * @returns {string} URL of generated map
     */
    getMapUrl(latitude, longitude, tags = [], zoom = 10) {
        if (this.#apiKey === '') {
            console.log("No API key provided.");
            return "images/mapview.jpg";
        }

        let tagList = `${latitude},${longitude}|marker-start`;
        tagList += tags.reduce((acc, tag) => `${acc}||${tag.latitude},${tag.longitude}|flag-${tag.name}`, "");

        const mapQuestUrl = `https://www.mapquestapi.com/staticmap/v5/map?key=${this.#apiKey}&size=600,400&zoom=${zoom}&center=${latitude},${longitude}&locations=${tagList}`;
        console.log("Generated MapQuest URL:", mapQuestUrl);

        return mapQuestUrl;
    }
}


function updateLocation() {
    LocationHelper.findLocation(function(helper) {
        var taggingLatitudeInput = document.getElementById("latitude_tagging");
        var taggingLongitudeInput = document.getElementById("longitude_tagging");
        var discoveryLatitudeInput = document.getElementById("latitude_discovery");
        var discoveryLongitudeInput = document.getElementById("longitude_discovery");

        taggingLatitudeInput.value = helper.latitude;
        taggingLongitudeInput.value = helper.longitude;

        discoveryLatitudeInput.value = helper.latitude;
        discoveryLongitudeInput.value = helper.longitude;

        console.log("Current location of User: Latitude: " + helper.latitude + ", Longitude: " + helper.longitude);

        var mapManager = new MapManager("FtWHGJMvdole3bKfpGDmCaVTIfY24EJj");
        var mapImage = document.getElementById("mapView");
        mapImage.src = mapManager.getMapUrl(helper.latitude, helper.longitude, [], 17);
    });
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});