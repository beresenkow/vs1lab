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
        console.log("GetNearbyGeoTags lat: " + latitude + " long: " + longitude + " rad: " + radius);

        let nearbyGeoTags = [];

        for (let i = 0; i < this._geoTags.length; i++) {
            const currentTag = this._geoTags[i];

            // Primitive Calculation of the distance.
            // const distance = Math.sqrt(Math.pow(longitude - currentTag.getLatitude(), 2) + 
            //                  Math.pow(currentTag.getLongitude() - latitude, 2));

            const distance = this.dist(latitude, longitude, currentTag.getLatitude(), currentTag.getLongitude());

            if (distance <= radius) {
                nearbyGeoTags.push(this._geoTags[i]);
            }
        }

        return nearbyGeoTags;
    }

    searchNearbyGeoTags(latitude, longitude, radius, keyword) {
        console.log("SearchNearbyGeoTags lat: " + latitude + " long: " + longitude + " rad: " + radius + " key: " + keyword);

        let nearbyGeoTags = this.getNearbyGeoTags(latitude, longitude, radius);

        let foundGeoTags = [];

        for (let i = 0; i < nearbyGeoTags.length; i++) {
            const name = nearbyGeoTags[i].getName();
            const hashtag = nearbyGeoTags[i].getHashtag();

            if (name !== undefined && name.includes(keyword) ||
                hashtag !== undefined && hashtag.includes(keyword)) {
                foundGeoTags.push(nearbyGeoTags[i]);
            }
        }

        return foundGeoTags;
    }

    dist(lat1, lon1, lat2, lon2) {
        // Calculaition of the distance concidering the curvature of the earth.
        const R = 6371; // Earth radius in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }  

    getAllGeoTags() {
        let allGeoTags = [];
        for (let i = 0; i < this._geoTags.length; i++) {
            allGeoTags.push(this._geoTags[i]);
        }
        return allGeoTags;
    }
}

module.exports = InMemoryGeoTagStore
