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
        'mqpacker':             true,
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