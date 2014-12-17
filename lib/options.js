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

    

    /**
     *
     * Options
     *
     */
    this.options = this.extend(this.defaults);

    //this.options = this.extendConfig(this.defaults, configFile);
    //this.options = this.extendValues(this.values);

}

/**
 *
 * Extend config with .pleeeaserc
 *
 */
Options.prototype.extendConfig = function (opts, pathConfig) {

    pathConfig = pathConfig || this.configFile;

    var fs   = require('fs'),
        path = require('path');

    // read pleeeaserc
    var config = {};
    if (fs.existsSync !== undefined && path.existsSync !== undefined) {
        if ((fs.existsSync || path.existsSync)(pathConfig)) {
            config = JSON.parse(fs.readFileSync(pathConfig));
        }
    }

    // extend
    return extend(opts, config);

};

/**
 *
 * Extend Values
 * Set defaults values if an option is set to true
 *
 */
Options.prototype.extendValues = function (opts, source) {

    source = source || this.options;

    var src, val;
    for (var key in opts) {

        src = source[key];
        val = opts[key];

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
 * Extend options
 *
 */
Options.prototype.extend = function (opts) {

    var options = this.options || this.defaults;

    // extend options
    options = extend(options, opts);

    // extend configuration
    options = this.extendConfig(options);

    // extend values
    options = this.extendValues(this.values, options);

    // override options with browsers' one
    // if `browsers` option is set:
    //   - Replace autoprefixer's one
    //   - Set all other options
    // if `autoprefixer.browsers` option is set:
    //   - Set all other options
    if (options.browsers) {
        if (!Array.isArray(options.browsers)) {
            options.browsers = [options.browsers];
        }
        options.autoprefixer.browsers = options.browsers;
    }
    if (options.autoprefixer.browsers) {
        var _opts = {
            browsers: options.browsers || options.autoprefixer.browsers
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
                    options[feature] = !options[feature];
                }
            }
        }
    }

    // extend values
    options = this.extendValues(this.values, options);

    return options;

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