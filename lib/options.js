'use strict';
var extend = require('deep-extend');

/**
 *
 * Constructor Options
 *
 */
function Options () {

    this.configFile = '.pleeeaserc';

    /**
     *
     * Defaults options for pleeease
     *
     */
    this.defaults = {
        'in':                   '*.css',
        'out':                  'app.min.css',

        'sourcemaps':           false,

        'autoprefixer':         true,
        'filters':              true,
        'rem':                  true,
        'pseudoElements':       true,
        'opacity':              true,

        'import':               true,
        'mqpacker':             false,
        'minifier':             true,

        'next':                 false
    };

    /**
     *
     * Defaults values
     *
     */
    this.values = {
        'autoprefixer':         {},
        'filters':              {},
        'rem':                  ['16px'],

        'import':               {},
        'minifier':             {preserveHacks: true},

        'next': {
            'customProperties': {},
            'customMedia':      true,
            'calc':             true,
            'colors':           {}
        }
    };

    var fs   = require('fs'),
        path = require('path');

    // extend pleeeaserc
    if (fs.existsSync !== undefined && path.existsSync !== undefined) {

        if ((fs.existsSync || path.existsSync)(this.configFile)) {
            var pleeeaserc = JSON.parse(fs.readFileSync(this.configFile));

            // extend
            this.defaults = extend(this.defaults, pleeeaserc);

        }

    }

}

/**
 *
 * Extend options
 *
 */
Options.prototype.extend = function (options) {

    // extend options
    this.defaults = extend(this.defaults, options);

    // extend values
    this.defaults = this.extendValues(this.values);

    // override options with browsers' one
    // if `browsers` option is set:
    //   - Replace autoprefixer's one
    //   - Set all other options
    // if `autoprefixer.browsers` option is set:
    //   - Set all other options
    if (this.defaults.browsers) {
        if (!Array.isArray(this.defaults.browsers)) {
            this.defaults.browsers = [this.defaults.browsers];
        }
        this.defaults.autoprefixer.browsers = this.defaults.browsers;
    }
    if (this.defaults.autoprefixer.browsers) {
        var _opts = {
            browsers: this.defaults.browsers || this.defaults.autoprefixer.browsers
        };
        var Browsers = require('./browsers');
        var browsers = new Browsers(_opts);
        for (var i = browsers.selected.length - 1; i >= 0; i--) {
            var browserSelected = browsers.selected[i];
            for (var feature in browsers.features) {
                var find = false;
                for (var j = browsers.features[feature].length - 1; j >= 0; j--) {
                  var browserCompat = browsers.features[feature][j];
                  if (browserCompat === browserSelected) {
                    find = true;
                    break;
                  }
                }
                if (!find) {
                    this.defaults[feature] = !this.defaults[feature];
                }
            }
        }
    }

    // extend values
    this.defaults = this.extendValues(this.values);

    return this.defaults;

};

/**
 *
 * Extend Values
 * Set defaults values if an option is set to true
 *
 */
Options.prototype.extendValues = function (values, source) {

    source = source || this.defaults;

    var src, val;
    for (var key in values) {

        src = source[key];
        val = values[key];

        if (src === true) {
            source[key] = val;
        }

        else if (key === 'next' && src !== false) {
            source[key] = this.extendValues(val, src);
        }

    }

    return source;

};

/**
 *
 * New Options instance
 *
 */
var options = function() {
    return new Options();
};

/**
 *
 * Exports
 *
 */
module.exports = options;