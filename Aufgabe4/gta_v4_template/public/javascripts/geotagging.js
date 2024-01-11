// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

import { LocationHelper } from './location-helper.js';
import { MapManager } from "./map-manager.js";

const taggingButton = document.getElementById("addTagButton");
const discoveryButton = document.getElementById("discoveryButton");

const paginatedList = document.getElementById("discoveryResults");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const paginationLimit = 5;

var listItems = paginatedList.querySelectorAll("li");
var pageCount = Math.ceil(listItems.length / paginationLimit);
var currentPage = 1;
var totalGeoTags = 11;

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
    var mapManager = new MapManager("FtWHGJMvdole3bKfpGDmCaVTIfY24EJj");
    const mapImage = document.getElementById("mapView");
    const tagsJson = mapImage.getAttribute("data-taglist");
    let tags = JSON.parse(tagsJson);
    mapImage.src = mapManager.getMapUrl(latitude, longitude, tags, 17);
}

function drawMapWithGeotags(geotags) {
    const mapImage = document.getElementById("mapView");
    
    console.log("Geotags Draw Map with Geotags: " + geotags);
    //console.log("Already Used GeoTags: " + mapImage.getAttribute("data-taglist"));

    var latitude = parseFloat(document.getElementById("latitude_tagging").value);
    var longitude = parseFloat(document.getElementById("longitude_tagging").value);
    console.log("Current Location: " + latitude, longitude);

    var mapManager = new MapManager("FtWHGJMvdole3bKfpGDmCaVTIfY24EJj");
    
    mapImage.src = mapManager.getMapUrl(latitude, longitude, JSON.parse(geotags), 17);
    return geotags;
}

function updateList(geotags) {
    if (!geotags) {
        console.log("Geotag is undefined or null.");
        return Promise.resolve(); // Resolve the promise without processing further
    }

    console.log("Geotags Update List: " + geotags);

    var list = JSON.parse(geotags);
    console.log("parsed geotags: ", list);
    var ul = document.getElementById("discoveryResults");
    ul.innerHTML = "";
    list.forEach(function (gtag) {
        if (gtag) {
            console.log(gtag);
            var li = document.createElement("li");
            li.innerHTML = gtag.name + " (" + gtag.latitude + ", " + gtag.longitude + ") " + gtag.hashtag;
            li.classList.add("geoTagElement");
            ul.appendChild(li);
        } else {
            var li = document.createElement("li");
            li.classList.add("hidden");
            ul.appendChild(li);
        }
    })
    document.getElementById("name").value = "";
    document.getElementById("hashtag").value = "";

    listItems = paginatedList.querySelectorAll("li");

    return parseInt(document.getElementById("discoveryResults").innerHTML);
}

const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
};

const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
};

const handlePageButtonsStatus = () => {
    if (currentPage === 1) {
        disableButton(prevButton);
    } else {
        enableButton(prevButton);
    }

    if (pageCount === currentPage) {
        disableButton(nextButton);
    } else {
        enableButton(nextButton);
    }
};

const retrieveListElements = (pageNum) => {
    currentPage = pageNum;

    handlePageButtonsStatus();
    updatePageCount();

    var Item = fetchPaginationTags(currentPage);

    console.log("Pagination Fetched", Item);
    return Item;
};

function updatePageCount() {
    const pageCountElement = document.getElementById("pageCount");
    pageCountElement.textContent = `${currentPage} / ${pageCount} (${totalGeoTags})`;
}

function updatePage(){
    pageCount = Math.ceil(listItems.length / paginationLimit);
    totalGeoTags = listItems.length;
    retrieveListElements(currentPage);
}

// async function for the Tagging EventListener
async function tagging(geotag){
    console.log(geotag);
    var response = await fetch("http://localhost:3000/api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(geotag)
    });

    console.log(response);
    return await response.json();
}

// async function for the Discovery EventListener
async function discovery(searchInput){
    var response = await fetch("http://localhost:3000/api/geotags/" + searchInput,{
        method: "GET",
        headers: {"Content-Type": "application/json"}
    });

    console.log(response);
    return await response.json();
}

async function fetchPaginationTags(page) {
    var response = await fetch("http://localhost:3000/api/geotags/" + page,{
        method: "GET",
        headers: {"Content-Type": "application/json"}
    });

    return await response.json();
}

// EventListener for the Tagging Submit Button
taggingButton.addEventListener("click", function (event) {
    event.preventDefault();

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

    tagging(geotag).then(drawMapWithGeotags).then(updateList).then(updatePage);
});

// EventListener for the Discovery Submit Button
discoveryButton.addEventListener("click", function (event) {
    event.preventDefault();

    currentPage = 1;
    updatePageCount();
    var searchTerm = document.getElementById("searchterm").value;
    console.log("Trying to search for GeoTags that match the keyWord: " + searchTerm);

    discovery(searchTerm).then(drawMapWithGeotags).then(updateList).then(updatePage);
});

prevButton.addEventListener("click", () => {
    retrieveListElements(currentPage - 1).then(updateList).then(updatePage);
});

nextButton.addEventListener("click", () => {
    retrieveListElements(currentPage + 1).then(updateList).then(updatePage);
});

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation, retrieveListElements(currentPage).then(updateList).then(updatePage));