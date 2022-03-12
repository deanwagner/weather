"use strict";

import Themes from './themes.js';

/**
 * Theme
 * @class
 * @property {string} default - Default Theme
 * @property {array}  styles  - CSS Style Properties
 * @author Dean Wagner <info@deanwagner.net>
 */
class Theme {

    default = 'clouds-day';
    styles  = [
        'text',
        'title',
        'accent',
        'item',
        'shadow'
    ];

    /**
     * Constructor
     * @constructor
     */
    constructor() {
        // Change Theme in Settings
        document.getElementById('user_theme').addEventListener('input', (e) => {
            if (e.target.value === '') {
                this.loadTheme(this.default);
            } else {
                this.loadTheme(e.target.value);
            }
        });
    }

    /**
     * Load Theme
     * @param {string} name - Theme Name
     */
    loadTheme(name) {

        // Get Theme
        const theme = Themes.find(thm => thm.name === name);

        // Set CSS Style Properties
        this.styles.forEach(style => {
            this.setStyleProperty(style, theme[style]);
        });

        document.body.style.backgroundImage = `url(./img/${theme.image})`;
        document.body.style.backgroundPosition = theme.place;

        const alpha = '0.9';
        const color = this.hexToRgb(theme.item);
        const container = document.getElementsByClassName('container');
        for(let i = 0; i < container.length; i++) {
            container[i].style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        }

        // Insert Photo Credits
        const cite = document.getElementsByTagName('cite')[0];
        cite.innerHTML = `Photo by <a href="${theme.profile}" rel="external" target="_blank">${theme.credit}</a> from <a href="${theme.link}" rel="external" target="_blank">${theme.site}</a>`;

        // Hide Loading Screen
        if (document.body.classList.contains('loading')) {
            document.getElementById('loading').style.display = 'none';
            document.body.classList.remove('loading');
        }
    }

    /**
     * Set Theme
     * @param {string} cond - Weather Conditions
     * @param {string} tod - Time of Day (day|night)
     */
    setTheme(cond, tod) {
        const name = this.getTheme(cond, tod);
        this.default = name;
        this.loadTheme(name);
    }

    /**
     * Get Theme
     * @param {string} cond - Weather Conditions
     * @param {string} tod - Time of Day (day|night)
     * @returns {string}
     */
    getTheme(cond, tod) {
        let theme;
        cond = cond.toLowerCase();
        switch (true) {
            case ((cond === 'clear') && (tod === 'day')):
                theme = 'clear-day';
                break;
            case ((cond === 'clear') && (tod === 'night')):
                theme = 'clear-night';
                break;
            case ((cond === 'clouds') && (tod === 'day')):
                theme = 'clouds-day';
                break;
            case ((cond === 'clouds') && (tod === 'night')):
                theme = 'clouds-night';
                break;
            case (cond === 'drizzle'):
                theme = 'drizzle';
                break;
            case (cond === 'rain'):
                theme = 'rain';
                break;
            case (cond === 'storm'):
                theme = 'storm';
                break;
            case (cond === 'snow'):
                theme = 'snow';
                break;
            case (cond === 'haze'):
                theme = 'haze';
                break;
            case (cond === 'wind'):
                theme = 'wind';
                break;
            default:
                theme = 'clouds';
        }
        return theme;
    }

    /**
     * Hex to RGB
     * @param {string} hex - Hex Color Code
     * @returns {object|null} - RGB Object | Null
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * Set CSS Property
     * @param {string} prop  - Property
     * @param {string} value - Value
     */
    setStyleProperty(prop, value) {
        const property = '--color-' + prop;
        document.documentElement.style.setProperty(property, value);
    }
}

export default Theme;