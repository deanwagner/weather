class Settings {

    time    = '';
    unit    = '';
    theme   = '';
    modal   = {};
    storage = {};

    default = {
        time  : '12hr',
        unit  : 'imperial',
        theme : ''
    }

    constructor(modal) {
        this.modal = modal;
        this.storage = window.localStorage;

        if (this.storage.hasOwnProperty('weather_settings')) {
            const stored = JSON.parse(this.storage.getItem('weather_settings'));
            this.time  = stored.time;
            this.unit  = stored.unit;
            this.theme = stored.theme;
        } else {
            this.time  = this.default.time;
            this.unit  = this.default.unit;
            this.theme = this.default.theme;
        }

        document.getElementById('settings').addEventListener('click', (e) => {
            e.preventDefault();
            this.modal.open('modal_settings');
        });
    }
}

export default Settings;