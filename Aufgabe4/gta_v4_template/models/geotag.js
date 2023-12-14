// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

    constructor(name, latitude, longitude, hashtag) {
        // constructor that creates a new GeoTag.
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.hashtag = hashtag;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getLatitude() {
        return this.latitude;
    }

    setLatitude(latitude) {
        this.latitude = latitude;
    }

    getLongitude() {
        return this.longitude;
    }

    setLongitude(longitude) {
        this.longitude = longitude;
    }

    getHashtag() {
        return this.hashtag;
    }

    setHashtag(hashtag) {
        this.hashtag = hashtag;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }
}

module.exports = GeoTag;
