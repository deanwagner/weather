"use strict";

// Import Modules
import Theme from './theme.js';
import Icons from './icons.js'

/**
 * Weather
 * @class
 * @author Dean Wagner <info@deanwagner.net>
 */
class Weather {

    // Class Properties
    theme   = {};
    icons   = {};
    weather = {};

    temp = 'http://api.openweathermap.org/data/2.5/onecall?lat=34.0522&lon=-118.2437&units=imperial&exclude=minutely&APPID=08741ea66d7d6792d95ff754f4184d75';

    /**
     * Constructor
     * @constructor
     */
    constructor() {
        this.theme = new Theme();
        this.icons = new Icons();

        this.getWeather();
    }

    /**
     * Loads Default Books from JSON
     */
    getWeather() {
        fetch(this.temp)
            .then(response => response.json())
            .then(json => {
                // Load Books into Library
                this.loadWeather(json);
            });
    }

    loadWeather(json) {
        this.weather = json;
        this.populate();
    }

    populate() {
        const cond = document.getElementById('main_cond');

        const main = this.weather.current.weather[0].main;
        const desc = this.weather.current.weather[0].description;
        const temp = Math.floor(parseInt(this.weather.current.temp)) + '&deg;'
        const tod  = 'day';

        let str = this.icons.fetch(desc, tod);
        str += ' ' + temp;

        cond.innerHTML = str;

        this.theme.setTheme(this.theme.getTheme(main), tod);
    }
}

export default Weather;