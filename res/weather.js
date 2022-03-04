"use strict";

// Import Modules
// import Something from './res/file.js';

/**
 * Weather
 * @class
 * @property {string} property - Class Property
 * @author Dean Wagner <info@deanwagner.net>
 */
class Weather {

    // Class Properties
    property = '';

    /**
     * Constructor
     * @constructor
     */
    constructor() {
        this.property = '';
    }

    /**
     * Get Class Property
     * @returns {string} - Class Property
     */
    get property() {
        return this.property;
    }

    /**
     * Set Class Property
     * @param {string} parameter - Method Parameter
     */
    set property(parameter) {
        this.property = parameter;
    }
}

export default Weather;