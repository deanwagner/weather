"use strict";

/**
 * Location
 * @class
 * @property {object} modal   - Modal Module
 * @property {object} storage - LocalStorage
 * @property {string} token   - API App ID
 * @property {string} limit   - Location Return Limit
 * @property {string} city    - City Name
 * @property {string} state   - State Name
 * @property {string} country - Country Code
 * @property {string} lat     - Latitude
 * @property {string} lon     - Longitude
 * @property {object} default - Default Location
 * @author Dean Wagner <info@deanwagner.net>
 */
class Location {

    // Class Properties
    modal   = {};
    storage = {};
    token   = '';
    limit   = '5';
    city    = '';
    state   = '';
    country = '';
    lat     = '';
    lon     = '';

    // Default Location
    default = {
        city    : 'Los Angeles',
        state   : 'California',
        country : 'US',
        lat     : '34.0522',
        lon     : '-118.2437'
    };

    /**
     * Constructor
     * @constructor
     * @param {object} modal - Modal Module
     * @param {string} token - API App ID
     */
    constructor(modal, token) {

        // Class Properties
        this.modal   = modal;
        this.token   = token;
        this.storage = window.localStorage;

        // Load Location
        if (this.storage.hasOwnProperty('weather_location')) {

            // Stored Location
            const stored = JSON.parse(this.storage.getItem('weather_location'));
            this.city    = stored.city;
            this.state   = stored.state;
            this.country = stored.country;
            this.lat     = stored.lat;
            this.lon     = stored.lon;
        } else {

            // Default Location
            this.city    = this.default.city;
            this.state   = this.default.state;
            this.country = this.default.country;
            this.lat     = this.default.lat;
            this.lon     = this.default.lon;
        }

        // Open Location Modal
        document.getElementById('location').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('location_city').innerText    = this.city;
            document.getElementById('location_state').innerText   = this.state;
            document.getElementById('location_country').innerText = this.country;
            document.getElementById('location_lat').innerText     = this.lat;
            document.getElementById('location_lon').innerText     = this.lon;
            document.getElementById('location_search').innerText  = '';
            this.modal.open('modal_location');
        });

        // Get Location Button
        document.getElementById('location_get').addEventListener('click', (e) => {
            e.preventDefault();
            navigator.permissions.query({name:'geolocation'}).then(result =>  {
                if (result.state === 'granted') {
                    navigator.geolocation.getCurrentPosition(this.setCCoords.bind(this));
                } else if (result.state === 'prompt') {
                    navigator.geolocation.getCurrentPosition(this.setCCoords.bind(this));
                } else if (result.state === 'denied') {
                    // Access Denied
                } else {
                    // Error
                }
            });
        });

        // Search Submit
        document.querySelector('#location_set form').addEventListener('submit', (e) => {
            e.preventDefault();

            const query = document.getElementById('location_search').value;
            this.getCoords(query);

            return false;
        });

        // Reset Location
        document.getElementById('location_reset').addEventListener('click', (e) => {
            e.preventDefault();

            this.city    = this.default.city;
            this.state   = this.default.state;
            this.country = this.default.country;
            this.lat     = this.default.lat;
            this.lon     = this.default.lon;

            document.getElementById('location_city').innerText    = this.city;
            document.getElementById('location_state').innerText   = this.state;
            document.getElementById('location_country').innerText = this.country;
            document.getElementById('location_lat').innerText     = this.lat;
            document.getElementById('location_lon').innerText     = this.lon;
            document.getElementById('location_search').innerText  = '';

            this.storage.removeItem('weather_location');
        });

        // Save Location
        document.getElementById('location_save').addEventListener('click', (e) => {
            e.preventDefault();

            this.storage.setItem('weather_location', JSON.stringify({
                city    : this.city,
                state   : this.state,
                country : this.country,
                lat     : this.lat,
                lon     : this.lon
            }));

            location.reload();
        });

        // Confirm Location
        document.querySelector('#location_confirm form').addEventListener('submit', (e) => {
            e.preventDefault();

            const options = document.querySelectorAll('#location_confirm fieldset input');
            for(let i = 0; i < options.length; i++) {
                if (options[i].checked) {
                    this.locationConfirmed(JSON.parse(options[i].value));
                    i = options.length;
                }
            }

            return false;
        });
    }

    setCCoords(position) {
        this.lat = position.coords.latitude.toFixed(4);
        this.lon = position.coords.longitude.toFixed(4);
        document.getElementById('location_lat').innerText = this.lat;
        document.getElementById('location_lon').innerText = this.lon;
        this.getLocation();
    }

    getLocation() {
        let url = 'https://api.openweathermap.org/geo/1.0/reverse?';
        url += 'lat=' + this.lat.toString();
        url += '&lon=' + this.lon.toString();
        url += '&limit=1';
        url += '&appid=' + this.token;

        // Loading
        document.getElementById('location_set').style.display = 'none';
        document.getElementById('location_loading').style.display = 'flex';

        fetch(url)
            .then(response => response.json())
            .then(json => {
                this.setLocation(json);
            });
    }

    setLocation(json) {
        if (json.length > 0) {
            this.city    = json[0].name;
            this.state   = (json[0].hasOwnProperty('state')) ? json[0].state : '';
            this.country = json[0].country;
            document.getElementById('location_city').innerText    = this.city;
            document.getElementById('location_state').innerText   = this.state;
            document.getElementById('location_country').innerText = this.country;

            document.getElementById('location_set').style.display = 'block';
            document.getElementById('location_loading').style.display = 'none';
        } else {
            // No Result
        }
    }

    getCoords(query) {
        let url = 'https://api.openweathermap.org/geo/1.0/direct?';
        url += 'q=' + query;
        url += '&limit=' + this.limit;
        url += '&appid=' + this.token;

        // Loading
        document.getElementById('location_set').style.display = 'none';
        document.getElementById('location_loading').style.display = 'flex';

        fetch(url)
            .then(response => response.json())
            .then(json => {
                this.confirmLocation(json);
            });
    }

    confirmLocation(json) {
        const locationSet = document.getElementById('location_set');

        if (json.length === 1) {

            // Single Result
            this.city    = json[0].name;
            this.state   = (json[0].hasOwnProperty('state')) ? json[0].state : '';
            this.country = json[0].country;
            this.lat     = parseFloat(json[0].lat).toFixed(4);
            this.lon     = parseFloat(json[0].lon).toFixed(4);

            document.getElementById('location_city').innerText    = this.city;
            document.getElementById('location_state').innerText   = this.state;
            document.getElementById('location_country').innerText = this.country;
            document.getElementById('location_lat').innerText     = this.lat.toString();
            document.getElementById('location_lon').innerText     = this.lon.toString();

            // Hide Loading
            document.getElementById('location_loading').style.display = 'none';
            document.getElementById('location_set').style.display = 'block';
        } else if (json.length > 1) {

            // Multiple Results
            const options = document.querySelector('#location_confirm fieldset');
            const legend  = document.createElement('legend');
            options.innerHTML = '';
            legend.innerText  = 'Select Location';
            options.appendChild(legend);

            json.forEach((loc, index) => {
                const radio = document.createElement('input');
                const label = document.createElement('label');

                radio.setAttribute('id', 'option_' + index.toString());
                radio.setAttribute('name', 'location_option');
                radio.setAttribute('value', JSON.stringify(loc));
                radio.setAttribute('type', 'radio');

                label.setAttribute('for', 'option_' + index.toString());
                label.innerText = loc.name + ', ' + loc.state + ', ' + loc.country;

                options.appendChild(radio);
                options.appendChild(label);
            });

            // Hide Loading
            document.getElementById('location_loading').style.display = 'none';
            document.getElementById('location_confirm').style.display = 'block';
        } else {

            // No Results
            locationSet.style.display = 'none';
            document.getElementById('error_message').innerText = 'There are no matches to your search.';
            document.getElementById('location_loading').style.display = 'none';
            document.getElementById('location_error').style.display = 'block';
        }
    }

    locationConfirmed(json) {
        this.city    = json.name;
        this.state   = (json.hasOwnProperty('state')) ? json.state : '';
        this.country = json.country;
        this.lat     = parseFloat(json.lat).toFixed(4);
        this.lon     = parseFloat(json.lon).toFixed(4);

        document.getElementById('location_city').innerText    = this.city;
        document.getElementById('location_state').innerText   = this.state;
        document.getElementById('location_country').innerText = this.country;
        document.getElementById('location_lat').innerText     = this.lat.toString();
        document.getElementById('location_lon').innerText     = this.lon.toString();

        document.getElementById('location_confirm').style.display = 'none';
        document.getElementById('location_set').style.display = 'block';
    }
}

export default Location;