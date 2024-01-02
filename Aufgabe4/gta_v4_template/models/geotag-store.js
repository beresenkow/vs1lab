// File origin: VS1LAB A3

class InMemoryGeoTagStore{
    // A class for in-memory-storage of GeoTags.

    _geoTags;   // private store for all GeoTags.

    constructor() {
        // constructor for the creation of a new GeoTagStore.
        this._geoTags = [];
    }

    addGeoTag(geoTag) {
        // Method for adding a new GeoTag to the store.
        this._geoTags.push(geoTag);
    }

    removeGeoTag(name) {
        // Method for removing of a existing GeoTag from the store by name.
        this._geoTags = this._geoTags.filter(geoTag => geoTag.name !== name);
    }

    getNearbyGeoTags(latitude, longitude, radius) {
        // Algorithim that finds all GeoTags from the store, that are in the proximite of the current user's location.
        console.log("GetNearbyGeoTags lat: " + latitude + " long: " + longitude + " rad: " + radius);

        let nearbyGeoTags = [];

        for (let i = 0; i < this._geoTags.length; i++) {
            const currentTag = this._geoTags[i];
            const distance = this.dist(latitude, longitude, currentTag.latitude, currentTag.longitude);

            if (distance <= radius) {
                nearbyGeoTags.push(this._geoTags[i]);
            }
        }

        return nearbyGeoTags;
    }

    searchNearbyGeoTags(latitude, longitude, radius, keyword) {
        // Searchmethod for getting an array of GeoTags from the store, that are in in the proximity of a location that match a keyword.
        console.log("SearchNearbyGeoTags lat: " + latitude + " long: " + longitude + " rad: " + radius + " key: " + keyword);

        let nearbyGeoTags = this.getNearbyGeoTags(latitude, longitude, radius);
        let foundGeoTags = this.getGeoTagsBySearchterm(keyword, nearbyGeoTags);
        return foundGeoTags;
    }

    getGeoTagsBySearchterm(searchterm, store = this._geoTags) {
        // Searchmethod for getting an array of GeoTgas only by a keyword.
        console.log("Get Geotags by searchterm: " + searchterm);

        let geoTagStore = [];
        if (store !== undefined) {
            geoTagStore = store;
        }
        
        let foundGeoTags = [];
        for (let i = 0; i < geoTagStore.length; i++) {
            const name = geoTagStore[i].name;
            const hashtag = geoTagStore[i].hashtag;

            if (name !== undefined && name.includes(searchterm) ||
                hashtag !== undefined && hashtag.includes(searchterm)) {
                    foundGeoTags.push(geoTagStore[i]);
                }
        }
        return foundGeoTags;
    }

    generateFreshIds() {
        // Method, that generates fresh IDs for all GeoTags.
        // And it checks, that there are no double IDs.
        for (let i = 0; i < this._geoTags.length; i++) {
            if (this._geoTags[i].id === undefined ||
                this._geoTags[i].id !== i) {
                this._geoTags[i].id = i;
            }
        }
    }

    getGeoTagById(id) {
        // Returns a GeoTag with a givin ID.
        for (let i = 0; i < this._geoTags.length; i++) {
            if (this._geoTags[i].id === id) {
                return this._geoTags[i];
            }
        }
    }

    updateGeoTag(id, name, latitude, longitude, hashtag) {
        // Overwrites a GeoTag with new data by ID.
        const geoTag = this.getGeoTagById(id);
    
        if (geoTag) {
          geoTag.name = name;
          geoTag.latitude = latitude;
          geoTag.longitude = longitude;
          geoTag.hashtag = hashtag;
    
          return geoTag;
        }
    
        return null;
      }
    
    deleteGeoTag(id) {
        // Deletes a GeoTag from the store by ID.
        const geoTagIndex = this._geoTags.findIndex(geoTag => geoTag.id === id);

        if (geoTagIndex !== -1) {
            const deletedGeoTag = this._geoTags.splice(geoTagIndex, 1)[0];
            return deletedGeoTag;
        }

        return null;
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
        // Returns the entire store.
        return this._geoTags;
    }

    searchForInput(searchInput) {
        let result = null;
        if(this.isNumeric(searchInput)) {
            result = this.getGeoTagById(searchInput);
        }else if (this.isAllLetter(searchInput)) {
            result = this.getGeoTagByName(searchInput);
        }
        return result;
    }
    isNumeric(value){return /^\d+$/.test(value);}
    isAllLetter(string){return /^[A-Za-z]+$/.test(string);}
}

module.exports = InMemoryGeoTagStore
