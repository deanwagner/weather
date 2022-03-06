"use strict";

import Themes from './themes.js';

class Theme {

    styles = [
        'text',
        'title',
        'accent',
        'item',
        'shadow'
    ];

    constructor() {
        //test links
        const a = document.querySelectorAll('nav a');
        for(let i = 0; i < a.length; i++) {
            a[i].addEventListener('click', (e) => {
                e.preventDefault();
                this.setTheme(e.target.dataset.theme);
            });
        }
    }

    setTheme(name) {
        const theme = Themes.find(thm => thm.name === name);

        this.styles.forEach(style => {
            this.setStyleProperty(style, theme[style]);
        });

        document.body.style.backgroundImage = `url(./img/${theme.image})`;
        document.body.style.backgroundPosition = theme.place;

        const alpha = '0.8';
        const color = this.hexToRgb(theme.item);
        const container = document.getElementsByClassName('container');
        for(let i = 0; i < container.length; i++) {
            container[i].style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        }

        const cite = document.getElementsByTagName('cite')[0];
        cite.innerHTML = `Photo by <a href="${theme.profile}" rel="external" target="_blank">${theme.credit}</a> from <a href="${theme.link}" rel="external" target="_blank">${theme.site}</a>`;
    }

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
            case (cond === 'clouds'):
                theme = 'clouds';
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

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * Get CSS Property
     * @param {string} prop - Property
     * @returns {string} - Value
     */
    getStyleProperty(prop) {
        const property = '--color-' + prop;
        return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
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