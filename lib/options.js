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
        'in':                   ['*.css'],
        'out':                  'app.min.css',

        'sourcemaps':           false,

        'autoprefixer':         true,
        'filters':              true,
        'rem':                  true,
        'pseudoElements':       true,

        'import':               true,
        'mqpacker':             true,
        'minifier':             true,

        'next': {
            'customProperties': true
        }

    };

    /**
     *
     * Defaults values
     *
     */
    this.values = {
        'autoprefixer':         [],
        'filters':              {},
        'rem':                  [],

        'import':               process.cwd(),

        'next': {
            'customProperties': {}
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
    console.log('DEF1', this.defaults);
    // extend values
    this.defaults = this.extendValues(this.values);
    console.log('DEF2', this.defaults);
    return this.defaults;
}

/**
 *
 * Extend Values
 * Set defaults values if option is set to true
 *
 */
Options.prototype.extendValues = function (values, source) {

    var source = source || this.defaults;

    /*
    var src, val;
    for (var key in values) {
        src = source[key];
        val = values[key];

        if (typeof val === 'object' && !Array.isArray(val)) {
            source[key] = this.extendValues(val, src);
        }
        if (src === true) {
            source[key] = val;
        }
    }
    */

    if (source['autoprefixer'] === true) {
        source['autoprefixer'] = values['autoprefixer'];
    }
    if (source['filters'] === true) {
        source['filters'] = values['filters'];
    }
    if (source['rem'] === true) {
        source['rem'] = values['rem'];
    }
    if (source['import'] === true) {
        source['import'] = values['import'];
    }
    if (source['next']['customProperties'] === true) {
        source['next']['customProperties'] = values['next']['customProperties'];
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