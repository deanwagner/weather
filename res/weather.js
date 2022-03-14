"use strict";

// Import Modules
import Theme    from './theme.js';
import Icons    from './icons.js';
import Settings from './settings.js';
import Location from './location.js';
import Modal    from './modal/modal.js';

/**
 * Weather
 * @class
 * @property {object} theme    - Theme Module
 * @property {object} icons    - Icons Module
 * @property {object} modal    - Modal Module
 * @property {object} weather  - Weather Object
 * @property {string} exclude  - API Data Exclude
 * @property {string} token    - API App ID
 * @property {array}  weekdays - Days of the Week
 * @property {array}  months   - Months of the Year
 * @author Dean Wagner <info@deanwagner.net>
 */
class Weather {

    // Class Properties
    theme    = {};
    icons    = {};
    modal    = {};
    weather  = {};
    exclude  = 'minutely,hourly';
    token    = '08741ea66d7d6792d95ff754f4184d75';

    // Days of the Week
    weekdays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    // Months of the Year
    months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    /**
     * Constructor
     * @constructor
     */
    constructor() {
        // Class Properties
        this.modal    = new Modal();
        this.location = new Location(this.modal, this.token);
        this.settings = new Settings(this.modal);
        this.theme    = new Theme();
        this.icons    = new Icons();

        // Get Current Weather
        this.getWeather();
    }

    /**
     * Loads Default Books from JSON
     */
    getWeather() {

        // Build URL
        let url = 'https://api.openweathermap.org/data/2.5/onecall?';
        url += 'lat=' + this.location.lat.toString();
        url += '&lon=' + this.location.lon.toString();

        if (this.settings.unit !== 'standard') {
            url += '&units=' + this.settings.unit;
        }

        if (this.exclude !== '') {
            url += '&exclude=' + this.exclude;
        }

        url += '&APPID=' + this.token;

        // Fetch Response
        fetch(url)
            .then(response => response.json())
            .then(json => {
                // Load Weather Data
                this.loadWeather(json);
            });
    }

    /**
     * Load Weather
     * @param {json} json - JSON Result
     */
    loadWeather(json) {
        this.weather = json;
        this.populate();
    }

    /**
     * Populate Page with Weather Data
     */
    populate() {

        // Format Data
        const main = this.weather.current.weather[0].main;
        const desc = this.weather.current.weather[0].description;
        const now  = this.parseDate(this.weather.current.dt);
        const rise = this.parseDate(this.weather.current.sunrise);
        const set  = this.parseDate(this.weather.current.sunset);
        const mnr  = this.parseDate(this.weather.daily[0].moonrise);
        const mns  = this.parseDate(this.weather.daily[0].moonset);
        const moon = this.icons.moon(this.weather.daily[0].moon_phase);
        const tod  = ((now >= rise) && (now <= set)) ? 'day' : 'night';
        const date = new Date();
        const full = this.weekdays[date.getDay()] + ', ' + this.months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        const loc  = (this.location.state !== '') ? this.location.state + ', ' + this.location.country : this.location.country;

        // Page Elements
        const current  = document.getElementById('current');
        const forecast = document.getElementById('forecast');
        const mainCond = document.createElement('div');
        const subCond  = document.createElement('div');

        mainCond.setAttribute('id','main_cond');
        mainCond.classList.add('container');
        subCond.setAttribute('id','sub_cond');
        subCond.classList.add('container');

        // Main Conditions
        mainCond.innerHTML  = `
            <h2>${this.location.city}</h2>
            <div id="current_state">${loc}</div>
            <div id="current_dtg">${full}</div>
            <div id="current_info">
                <div id="current_icon">${this.icons.weather(desc, tod)}</div>
                <div id="current_temp">${this.formatTemp(this.weather.current.temp)}</div>
            </div>
            <div id="current_main">${main}</div>
            <div id="current_desc">${desc}</div>
            <div id="current_sum">
                <div id="current_like"><div>Feels Like</div>${this.formatTemp(this.weather.current.feels_like)}</div>
                <div id="current_high"><div>High</div>${this.formatTemp(this.weather.daily[0].temp.max)}</div>
                <div id="current_low"><div>Low</div>${this.formatTemp(this.weather.daily[0].temp.min)}</div>
            </div>`;

        // Add to DOM
        current.appendChild(mainCond);

        // Sub Conditions
        subCond.innerHTML  = this.buildSub('current_wind',       'windSpeed',  'Wind Speed', this.weather.current.wind_speed + ((this.settings.unit === 'imperial') ? 'mph' : 'kph'));
        subCond.innerHTML += this.buildSub('current_clouds',     'cloudCover', 'Clouds',     this.weather.current.clouds + '%');
        subCond.innerHTML += this.buildSub('current_humidity',   'humidity',   'Humidity',   this.weather.current.humidity + '%');
        subCond.innerHTML += this.buildSub('current_visibility', 'visibility', 'Visibility', this.formatNumber(this.weather.current.visibility) + ((this.settings.unit === 'imperial') ? 'ft' : 'm'));
        subCond.innerHTML += this.buildSub('current_uvi',        'uvIndex',    'UV Index',   this.weather.current.uvi);
        subCond.innerHTML += this.buildSub('current_sunrise',    'sunrise',    'Sunrise',    this.formatTime(rise));
        subCond.innerHTML += this.buildSub('current_sunset',     'sunset',     'Sunset',     this.formatTime(set));
        subCond.innerHTML += this.buildSub('current_moonrise',   'moonrise',   'Moonrise',   this.formatTime(mnr));
        subCond.innerHTML += this.buildSub('current_moonset',    'moonset',    'Moonset',    this.formatTime(mns));
        subCond.innerHTML += moon.icon;
        subCond.innerHTML += '<span class="current_label">Moon Phase:</span>';
        subCond.innerHTML += `<span id="current_phase" class="current_data">${moon.phase}</span>`;

        // Add to DOM
        current.appendChild(subCond);

        // 7-Day Forecast
        for (let i = 1; i < this.weather.daily.length; i++) {

            // Format Data
            const now  = this.parseDate(this.weather.daily[i].dt);
            const dtg  = new Date(now);
            const main = this.weather.daily[i].weather[0].main;
            const desc = this.weather.daily[i].weather[0].description;
            const rise = this.parseDate(this.weather.daily[i].sunrise);
            const set  = this.parseDate(this.weather.daily[i].sunset);
            const mnr  = this.parseDate(this.weather.daily[i].moonrise);
            const mns  = this.parseDate(this.weather.daily[i].moonset);
            const moon = this.icons.moon(this.weather.daily[i].moon_phase);

            // Create Container
            const container = document.createElement('div');
            container.classList.add('container');

            // Main Section
            container.innerHTML  = '<div class="forecast_weekday"><h3>' + this.weekdays[dtg.getDay()] + '</h3></div>';
            container.innerHTML += '<div class="forecast_date">' + this.formatDate(now) + '</div>';
            container.innerHTML += '<div class="forecast_icon">' + this.icons.weather(this.weather.daily[i].weather[0].description, 'day') + '</div>';
            container.innerHTML += '<div class="forecast_main">' + main + '</div>';
            container.innerHTML += '<div class="forecast_desc">' + desc + '</div>';

            // Sub Section
            const daySum = document.createElement('div');
            daySum.classList.add('forecast_sum');

            daySum.innerHTML += this.buildDay('forecast_high', '', '<span class="forecast_label">High:</span> ' + this.formatTemp(this.weather.daily[i].temp.max));
            daySum.innerHTML += this.buildDay('forecast_low', '', '<span class="forecast_label">Low:</span> ' + this.formatTemp(this.weather.daily[i].temp.min));
            daySum.innerHTML += this.buildDay('forecast_sunrise', 'sunrise', this.formatTime(rise));
            daySum.innerHTML += this.buildDay('forecast_sunset', 'sunset', this.formatTime(set));
            daySum.innerHTML += this.buildDay('forecast_moonrise', 'moonrise', this.formatTime(mnr));
            daySum.innerHTML += this.buildDay('forecast_moonset', 'moonset', this.formatTime(mns));

            // Add to Container
            container.appendChild(daySum);
            container.innerHTML += '<div class="forecast_phase">' + moon.icon + moon.phase + '</div>';

            // Add to DOM
            forecast.appendChild(container);
        }

        // Load Theme
        if (this.settings.theme !== '') {
            // User Set Theme
            this.theme.loadTheme(this.settings.theme);
        } else {
            // Auto Load Theme Based on Weather
            this.theme.setTheme(main, tod);
        }
    }

    /**
     * Build Sub Conditions
     * @param {string} id      - Element ID
     * @param {string} icon    - SVG Icon
     * @param {string} label   - Text Label
     * @param {string} content - Element Content
     * @returns {string} - HTML String
     */
    buildSub(id, icon, label, content) {
        let html = this.icons.fetch(icon);
        html += `<span class="current_label">${label}:</span>`;
        html += `<span id="${id}" class="current_data">${content}</span>`;
        return html;
    }

    /**
     * Build Forecast Day
     * @param {string} css     - CSS Class Name
     * @param {string} icon    - SVG Icon
     * @param {string} content - Element Content
     * @returns {string} - HTML String
     */
    buildDay(css, icon, content) {
        let html = `<div class="${css}">`;
        if (icon !== '') {
            html += this.icons.fetch(icon);
        }
        html += content + '</div>';
        return html;
    }

    /**
     * Parse Date
     * @param {string} time - Weather Timestamp
     * @returns {number} - JavaScript Timestamp
     */
    parseDate(time) {
        return parseInt(time) * 1000;
    }

    /**
     * Format Temperature
     * @param {string} temp - Raw Temperature
     * @returns {string} - Formatted Temperature
     */
    formatTemp(temp) {
        return Math.floor(parseInt(temp)).toString() + '&deg;';
    }

    /**
     * Format Number
     * @param {string} num - Raw Number
     * @returns {string} - Formatted Number
     */
    formatNumber(num) {
        return parseInt(num).toLocaleString();
    }

    /**
     * Format Date
     * @param {number} time - Timestamp
     * @returns {string} - Date String per Locale
     */
    formatDate(time) {
        const dtg = new Date(time);
        return dtg.toLocaleDateString();
    }

    /**
     * Format Time
     * @param {number} time - Timestamp
     * @returns {string} - 12/24 Hour Time
     */
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