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
    theme    = {};
    icons    = {};
    weather  = {};
    settings = {
        time : '12hr',
        unit : 'Imperial'
    };

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
        const main = this.weather.current.weather[0].main;
        const desc = this.weather.current.weather[0].description;
        const tod  = 'day';

        document.getElementById('current_dtg').innerText  = this.formatDate(this.weather.current.dt);
        document.getElementById('current_temp').innerHTML = this.formatTemp(this.weather.current.temp);
        document.getElementById('current_icon').innerHTML = this.icons.fetch(desc, tod);
        document.getElementById('current_main').innerText = main;
        document.getElementById('current_desc').innerText = desc;

        document.getElementById('current_like').innerHTML       = this.formatTemp(this.weather.current.feels_like);
        document.getElementById('current_wind').innerText       = this.weather.current.wind_speed + 'mph';
        document.getElementById('current_clouds').innerText     = this.weather.current.clouds + '%';
        document.getElementById('current_humidity').innerText   = this.weather.current.humidity + '%';
        document.getElementById('current_pressure').innerText   = this.weather.current.pressure + 'mb';
        document.getElementById('current_visibility').innerText = this.formatNumber(this.weather.current.visibility) + 'ft';
        document.getElementById('current_uvi').innerText        = this.weather.current.uvi;
        document.getElementById('current_dew').innerHTML        = this.formatTemp(this.weather.current.dew_point);
        document.getElementById('current_sunrise').innerText    = this.formatTime(this.weather.current.sunrise);
        document.getElementById('current_sunset').innerText     = this.formatTime(this.weather.current.sunset);

        const forecast = document.getElementById('forecast');

        for (let i = 0; i < this.weather.daily.length; i++) {
            const div = document.createElement('div');
            div.classList.add('container');
            div.innerHTML = this.formatTemp(this.weather.daily[i].temp.min) + '/' + this.formatTemp(this.weather.daily[i].temp.max);
            forecast.appendChild(div);
        }

        this.theme.setTheme(main, tod);
    }

    formatTemp(temp) {
        return  Math.floor(parseInt(temp)).toString() + '&deg;';
    }

    formatNumber(num) {
        return parseInt(num).toLocaleString();
    }

    formatDate(time) {
        return new Date(time).toLocaleDateString();
    }

    formatTime(time) {
        const dtg = new Date(time);
        let str;

        if (this.settings.time === '24hr') {
            str = dtg.getHours().toString().padStart(2, '0') + ':' + dtg.getMinutes().toString().padStart(2, '0');
        } else {
            let hour = dtg.getHours();
            let ampm;
            if (hour > 12) {
                hour = hour - 12;
                ampm = 'pm';
            } else {
                ampm = 'am';
                if (hour === 0) {
                    hour = 12;
                }
            }
            str = hour + ':' + dtg.getMinutes().toString().padStart(2, '0') + ampm;
        }

        return str;
    }
}

export default Weather;