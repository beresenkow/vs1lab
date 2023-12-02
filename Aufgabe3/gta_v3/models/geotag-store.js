// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    // TODO: ... your code here ...

    _geoTags;

    constructor() {
        this._geoTags = [];
    }

    addGeoTag(geoTag) {
        this._geoTags.push(geoTag);
    }

    removeGeoTag(name) {
        this._geoTags = this._geoTags.filter(geoTag => geoTag.getName() !== name);
    }

    getNearbyGeoTags(latitude, longitude, radius) {
        let nearybyGeoTags = [];
        
        for (let i = 0; i < this._geoTags.length; i++) {
            let distance = Math.sqrt(Math.pow(longitude - this._geoTags[i].getLatitude(), 2) + Math.pow(this._geoTags[i].getLongitude() - latitude, 2));
            if (distance <= radius) {
                nearybyGeoTags.push(this._geoTags[i]);
            }
        }

        return nearybyGeoTags;
    }

    searchNearbyGeoTags(latitude, longitude, radius, keyword) {
        let nearbyGeoTags = this.getNearbyGeoTags(latitude, longitude, radius);
        let foundGeoTags = [];
        for (let i = 0; i < nearbyGeoTags.length; i++) {
            if (nearbyGeoTags[i].getTagName().toLowerCase().includes(keyword.toLowerCase()) || nearbyGeoTags[i].getTagHashtag().toLowerCase().includes(keyword.toLowerCase())) {
                foundGeoTags.push(nearbyGeoTags[i]);
            }
        }

        return foundGeoTags;
    }
}

module.exports = InMemoryGeoTagStore
