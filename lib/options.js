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

        'sass':                 false,
        'less':                 false,
        'stylus':               false,

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
        'sass':                 {},
        'less':                 {syncImport: true},
        'stylus':               {},

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

}

/**
 *
 * isValidOptions
 * Check whether options are valid or not
 *
 */
Options.prototype.isValidOptions = function (opts) {

    // check preprocessors options
    if ( (opts.sass   && (opts.less || opts.stylus)) ||
         (opts.less   && (opts.sass || opts.stylus)) ||
         (opts.stylus && (opts.sass || opts.less  )) ) {
            throw new Error('You can\'t use more than one preprocessor');
    }

    return opts;

};
/**
 *
 * Extend values
 *
 */
Options.prototype.extendValues = function (opts, values) {

    for (var key in values) {
        var opt = opts[key];
        var val = values[key];

        if (opt === false) {
            continue;
        }
        if (opt === true) {
            opts[key] = val;
        } else if (typeof opt === 'object') {
            // special case
            if (key === 'next') {
                opts[key] = this.extendValues(opt, val);
            } else {
                opts[key] = extend(opt, val);
            }
        }
    }

    return opts;

};

/**
 *
 * Extend config with .pleeeaserc
 *
 */
Options.prototype.extendConfig = function (opts, pathConfig) {

    pathConfig = pathConfig || this.configFile;

    // read pleeeaserc
    var config = {};
    try {
        var fs   = require('fs');
        config = JSON.parse(fs.readFileSync(pathConfig, 'utf-8'));
    } finally {
        return extend(opts, config);
    }

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
        var find = [];
        for (var i = browsers.selected.length - 1; i >= 0; i--) {
            var browserSelected = browsers.selected[i];
            for (var feature in browsers.features) {
                if (find[feature]) {
                  continue;
                }
                find[feature] = false;
                for (var j = browsers.features[feature].length - 1; j >= 0; j--) {
                  var browserCompat = browsers.features[feature][j];
                  if (browserCompat === browserSelected) {
                    find[feature] = true;
                    options[feature] = true;
                    break;
                  }
                }
                if (!find[feature]) {
                  options[feature] = false;
                }
            }
        }
    }

    // extend values
    options = this.extendValues(options, this.values);

    return this.isValidOptions(options);

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