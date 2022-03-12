class Settings {

    // Class Properties
    time    = '';
    unit    = '';
    theme   = '';
    modal   = {};
    storage = {};

    // Default Settings
    default = {
        time  : '12hr',
        unit  : 'imperial',
        theme : ''
    }

    constructor(modal) {

        // Class Properties
        this.modal = modal;
        this.storage = window.localStorage;

        // Load Settings
        if (this.storage.hasOwnProperty('weather_settings')) {
            // Load from Storage
            const stored = JSON.parse(this.storage.getItem('weather_settings'));
            this.time  = stored.time;
            this.unit  = stored.unit;
            this.theme = stored.theme;
        } else {
            // Load Defaults
            this.time  = this.default.time;
            this.unit  = this.default.unit;
            this.theme = this.default.theme;
        }

        // Open Settings Modal
        document.getElementById('settings').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('user_units').value = this.unit;
            document.getElementById('user_clock').value = this.time;
            document.getElementById('user_theme').value = this.theme;
            this.modal.open('modal_settings');
        });

        // Reset Settings
        document.getElementById('settings_reset').addEventListener('click', (e) => {
            this.time  = this.default.time;
            this.unit  = this.default.unit;
            this.theme = this.default.theme;
            document.getElementById('user_units').value = this.unit;
            document.getElementById('user_clock').value = this.time;
            document.getElementById('user_theme').value = this.theme;
        });

        // Save Settings
        document.getElementById('settings_save').addEventListener('click', (e) => {
            this.time  = document.getElementById('user_clock').value;
            this.unit  = document.getElementById('user_units').value;
            this.theme = document.getElementById('user_theme').value;

            this.storage.setItem('weather_settings', JSON.stringify({
                time  : this.time,
                unit  : this.unit,
                theme : this.theme
            }));

            location.reload();
        });
    }
}

export default Settings;