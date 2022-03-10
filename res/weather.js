"use strict";

// Import Modules
import Theme from './theme.js';
import Icons from './icons.js';

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

    // LH: 34.6599, -118.3690
    // LA: 34.0522, -118.2437
    temp = 'https://api.openweathermap.org/data/2.5/onecall?lat=34.0522&lon=-118.2437&units=imperial&exclude=minutely,hourly&APPID=08741ea66d7d6792d95ff754f4184d75';
    city = 'Los Angeles';
    state = 'California';
    country = 'US';

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
        const now  = this.parseDate(this.weather.current.dt);
        const rise = this.parseDate(this.weather.current.sunrise);
        const set  = this.parseDate(this.weather.current.sunset);
        const mnr  = this.parseDate(this.weather.daily[0].moonrise);
        const mns  = this.parseDate(this.weather.daily[0].moonset);
        const moon = this.icons.moon(this.weather.daily[0].moon_phase);
        const tod  = ((now >= rise) && (now <= set)) ? 'day' : 'night';

        const mainCond = document.getElementById('main_cond');
        const sunCond  = document.getElementById('sub_cond');
        const forecast = document.getElementById('forecast');

        mainCond.innerHTML  = `<h2>${this.city}</h2>`;
        mainCond.innerHTML += this.buildMain('current_state', `${this.state}, ${this.country}`);
        mainCond.innerHTML += this.buildMain('current_dtg',   this.formatDate(now));
        mainCond.innerHTML += this.buildMain('current_temp',  this.formatTemp(this.weather.current.temp));
        mainCond.innerHTML += this.buildMain('current_icon',  this.icons.weather(desc, tod));
        mainCond.innerHTML += this.buildMain('current_main',  main);
        mainCond.innerHTML += this.buildMain('current_desc',  desc);
        //document.getElementById('current_like').innerHTML       = this.formatTemp(this.weather.current.feels_like);

        sunCond.innerHTML  = this.buildSub('current_wind',       'windSpeed',  'Wind Speed', this.weather.current.wind_speed + 'mph');
        sunCond.innerHTML += this.buildSub('current_clouds',     'cloudCover', 'Clouds',     this.weather.current.clouds + '%');
        sunCond.innerHTML += this.buildSub('current_humidity',   'humidity',   'Humidity',   this.weather.current.humidity + '%');
        sunCond.innerHTML += this.buildSub('current_visibility', 'visibility', 'Visibility', this.formatNumber(this.weather.current.visibility) + 'ft');
        sunCond.innerHTML += this.buildSub('current_uvi',        'uvIndex',    'UV Index',   this.weather.current.uvi);
        sunCond.innerHTML += this.buildSub('current_sunrise',    'sunrise',    'Sunrise',    this.formatTime(rise));
        sunCond.innerHTML += this.buildSub('current_sunset',     'sunset',     'Sunset',     this.formatTime(set));
        sunCond.innerHTML += this.buildSub('current_moonrise',   'moonrise',   'Moonrise',   this.formatTime(mnr));
        sunCond.innerHTML += this.buildSub('current_moonset',    'moonset',    'Moonset',    this.formatTime(mns));
        sunCond.innerHTML += this.buildSub('current_moonset',    'moonset',    'Moonset',    this.formatTime(mns));
        sunCond.innerHTML += moon.icon;
        sunCond.innerHTML += '<span class="current_label">Moon Phase:</span>';
        sunCond.innerHTML += `<span id="current_phase" class="current_data">${moon.phase}</span>`;

        //document.getElementById('current_pressure').innerText   = this.weather.current.pressure + 'mb';
        //document.getElementById('current_dew').innerHTML        = this.formatTemp(this.weather.current.dew_point);


        for (let i = 1; i < this.weather.daily.length; i++) {
            const now  = this.parseDate(this.weather.daily[i].dt);
            const dtg  = new Date(now);
            const rise = this.parseDate(this.weather.daily[i].sunrise);
            const set  = this.parseDate(this.weather.daily[i].sunset);
            const mnr  = this.parseDate(this.weather.daily[i].moonrise);
            const mns  = this.parseDate(this.weather.daily[i].moonset);
            const moon = this.icons.moon(this.weather.daily[i].moon_phase);

            const container = document.createElement('div');
            container.classList.add('container');

            container.innerHTML  = '<div class="forecast_weekday"><h3>' + this.weekdays[dtg.getDay()] + '</h3></div>';
            container.innerHTML += '<div class="forecast_date">' + this.formatDate(now) + '</div>';
            container.innerHTML += '<div class="forecast_icon">' + this.icons.weather(this.weather.daily[i].weather[0].description, 'day') + '</div>';
            container.innerHTML += this.buildDay('forecast_low', 'tempLow', '<span class="day_label">Low:</span> ' + this.formatTemp(this.weather.daily[i].temp.min));
            container.innerHTML += this.buildDay('forecast_high', 'tempHigh', '<span class="day_label">High:</span> ' + this.formatTemp(this.weather.daily[i].temp.max));
            container.innerHTML += this.buildDay('forecast_sunrise', 'sunrise', this.formatTime(rise));
            container.innerHTML += this.buildDay('forecast_sunset', 'sunset', this.formatTime(set));
            container.innerHTML += this.buildDay('forecast_moonrise', 'moonrise', this.formatTime(mnr));
            container.innerHTML += this.buildDay('forecast_moonset', 'moonset', this.formatTime(mns));
            container.innerHTML += '<div class="forecast_phase">' + moon.icon + moon.phase + '</div>';

            forecast.appendChild(container);
        }

        this.theme.setTheme(main, tod);
    }

    buildMain(id, content) {
        return `<div id="${id}">${content}</div>`;
    }

    buildSub(id, icon, label, content) {
        let html = this.icons.fetch(icon);
        html += `<span class="current_label">${label}:</span>`;
        html += `<span id="${id}" class="current_data">${content}</span>`;
        return html;
    }

    buildDay(css, icon, content) {
        let html = `<div class="${css}">`;
        html += this.icons.fetch(icon);
        html += content + '</div>';
        return html;
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