"use strict";

// Import Modules
import Theme from './theme.js';
import Icons from './icons.js'
import Moon  from './moon.js'

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
    moon     = {};

    // User Settings
    settings = {
        time : '12hr',
        unit : 'Imperial'
    };

    // Weekdays
    weekdays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    temp = 'http://api.openweathermap.org/data/2.5/onecall?lat=34.0522&lon=-118.2437&units=imperial&exclude=minutely&APPID=08741ea66d7d6792d95ff754f4184d75';

    /**
     * Constructor
     * @constructor
     */
    constructor() {
        this.theme = new Theme();
        this.icons = new Icons();
        this.moon  = new Moon();

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
        const now  = this.parseDate(this.weather.current.dt);
        const rise = this.parseDate(this.weather.current.sunrise);
        const set  = this.parseDate(this.weather.current.sunset);
        const mnr  = this.parseDate(this.weather.daily[0].moonrise);
        const mns  = this.parseDate(this.weather.daily[0].moonset);
        const moon = this.moon.phase(this.weather.daily[0].moon_phase);
        const tod  = ((now >= rise) && (now <= set)) ? 'day' : 'night';

        document.getElementById('current_dtg').innerText  = this.formatDate(now);
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
        document.getElementById('current_sunrise').innerText    = this.formatTime(rise);
        document.getElementById('current_sunset').innerText     = this.formatTime(set);
        document.getElementById('current_moonrise').innerText   = this.formatTime(mnr);
        document.getElementById('current_moonset').innerText    = this.formatTime(mns);
        document.getElementById('phase_placeholder').innerHTML  = moon.icon;
        document.getElementById('current_phase').innerText      = moon.phase;

        const forecast = document.getElementById('forecast');

        for (let i = 1; i < this.weather.daily.length; i++) {
            const now  = this.parseDate(this.weather.daily[i].dt);
            const dtg  = new Date(now);
            const rise = this.parseDate(this.weather.daily[i].sunrise);
            const set  = this.parseDate(this.weather.daily[i].sunset);
            const mnr  = this.parseDate(this.weather.daily[i].moonrise);
            const mns  = this.parseDate(this.weather.daily[i].moonset);
            const moon = this.moon.phase(this.weather.daily[i].moon_phase);

            const container = document.createElement('div');
            container.classList.add('container');

            const weekday = document.createElement('div');
            weekday.classList.add('forecast_weekday');
            weekday.innerHTML = '<h3>' + this.weekdays[dtg.getDay()] + '</h3>';
            container.appendChild(weekday);

            const timestamp = document.createElement('div');
            timestamp.classList.add('forecast_date');
            timestamp.innerText = this.formatDate(now);
            container.appendChild(timestamp);

            const tempLow = document.createElement('div');
            tempLow.classList.add('forecast_low');
            tempLow.innerHTML = this.formatTemp(this.weather.daily[i].temp.min);
            container.appendChild(tempLow);

            const tempHigh = document.createElement('div');
            tempHigh.classList.add('forecast_high');
            tempHigh.innerHTML = this.formatTemp(this.weather.daily[i].temp.max);
            container.appendChild(tempHigh);

            const sunrise = document.createElement('div');
            sunrise.classList.add('forecast_sunrise');
            sunrise.innerText = this.formatTime(rise);
            container.appendChild(sunrise);

            const sunset = document.createElement('div');
            sunset.classList.add('forecast_sunset');
            sunset.innerText = this.formatTime(set);
            container.appendChild(sunset);

            const moonrise = document.createElement('div');
            moonrise.classList.add('forecast_moonrise');
            moonrise.innerText = this.formatTime(mnr);
            container.appendChild(moonrise);

            const moonset = document.createElement('div');
            moonset.classList.add('forecast_moonset');
            moonset.innerText = this.formatTime(mns);
            container.appendChild(moonset);

            const phase = document.createElement('div');
            phase.classList.add('forecast_phase');
            phase.innerText = moon.phase;
            container.appendChild(phase);

            forecast.appendChild(container);
        }

        this.theme.setTheme(main, tod);
    }

    parseDate(time) {
        return parseInt(time) * 1000;
    }

    formatTemp(temp) {
        return Math.floor(parseInt(temp)).toString() + '&deg;';
    }

    formatNumber(num) {
        return parseInt(num).toLocaleString();
    }

    formatDate(time) {
        const dtg = new Date(time);
        return dtg.toLocaleDateString();
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