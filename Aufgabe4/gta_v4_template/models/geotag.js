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

    generateUniqueId() {
        return Math.floor(Math.random() * Date.now()).toString(36);
    }
    
    constructor(name, latitude, longitude, hashtag) {
        // constructor that creates a new GeoTag.
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.hashtag = hashtag;
        this.id = this.generateUniqueId(); //Einfechere ID-Übergabe muss implementiert werden!!!
    }

    getName() {
        return this.name;
    }

    getLatitude() {
        return this.latitude;
    }

    getLongitude() {
        return this.longitude;
    }

    getHashtag() {
        return this.hashtag;
    }

    getId() {
        return this.id;
    }
}

module.exports = GeoTag;
