class Location {

    // Class Properties
    modal   = {};
    storage = {};
    token   = '';
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

    constructor(modal, token) {
        this.modal   = modal;
        this.token   = token;
        this.storage = window.localStorage;

        if (this.storage.hasOwnProperty('weather_location')) {
            const stored = JSON.parse(this.storage.getItem('weather_location'));
            this.city    = stored.city;
            this.state   = stored.state;
            this.country = stored.country;
            this.lat     = stored.lat;
            this.lon     = stored.lon;
        } else {
            this.city    = this.default.city;
            this.state   = this.default.state;
            this.country = this.default.country;
            this.lat     = this.default.lat;
            this.lon     = this.default.lon;
        }

        document.getElementById('location').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('location_city').innerText    = this.city;
            document.getElementById('location_state').innerText   = this.state;
            document.getElementById('location_country').innerText = this.country;
            document.getElementById('location_lat').innerText     = this.lat;
            document.getElementById('location_lon').innerText     = this.lon;
            this.modal.open('modal_location');
        });

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
    }

    setCCoords(position) {
        console.log(position);
        this.lat = position.coords.latitude.toFixed(4);
        this.lon = position.coords.longitude.toFixed(4);
        document.getElementById('location_lat').innerText = this.lat;
        document.getElementById('location_lon').innerText = this.lon;
        this.getLocation();
    }

    getLocation() {
        let url = 'http://api.openweathermap.org/geo/1.0/reverse?';
        url += 'lat=' + this.lat;
        url += '&lon=' + this.lon;
        url += '&limit=1';
        url += '&appid=' + this.token;

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
        } else {
            // No Result
        }
    }

    getCoords() {
        let url = 'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}';
    }
}

export default Location;