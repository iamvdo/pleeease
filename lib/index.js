'use strict';

var postcss        = require('postcss'),
    prefixer       = require('autoprefixer'),
    minifier       = require('csswring'),
    mqpacker       = require('css-mqpacker'),
    vars           = require('postcss-vars'),
    rem            = require('pixrem'),
    filter         = require('pleeease-filters'),
    importer       = require('../lib/processors/import'),
    pseudoElements = require('../lib/processors/pseudoElements'),
    extend         = require('deep-extend');

var config,
    pipeline;

/**
 *
 * Add a new postprocessor to pipeline using the use() PostCSS's method
 * @param  {String}   name    Name of the postprocessor
 * @param  {Function} fn      Method to execute
 * @param  {Mixed}    options Arguments to pass to method
 *
 */
var usePlugin = function (name, fn, options) {

    if (options === undefined) {
        return pipeline.use(name[fn]);
    } else if (options === true) {
        return pipeline.use(name()[fn]);
    } else {
        // convert options to Array
        if (!Array.isArray(options)) {
            options = [options];
        }
        return pipeline.use(name.apply(null, options)[fn]);
    }

};

/**
 *
 * Constructor Pleeease
 * @param {Object} options
 *
 */
var Pleeease = function (options) {

    var defaults = require('../lib/options');
    config = extend(defaults, options);

};

/**
 *
 * Process stylesheet (chain and apply all postprocessors)
 * @param  {String} css
 * @return {String|Object} Processed css as String or Object.css|Object.map if sourcemaps is true
 *
 */
Pleeease.prototype.process = function (css) {

    var _options;

    // initialize the pipeline
    pipeline = postcss();

    // importer
    _options = config.optimizers.import;
    if (_options) {
        if (_options === true) {
            _options = process.cwd();
        }
        pipeline = usePlugin(importer, 'processor', [_options]);
    }

    // fallbacks
    _options = config.fallbacks;
    if (_options) {

        for (var fallback in _options) {

            if (_options.hasOwnProperty(fallback) && _options[fallback] !== false) {

                switch (fallback) {

                    // variables
                    case 'variables':
                        pipeline = usePlugin(vars, 'processor');
                        break;

                    // filters
                    case 'filters':
                        pipeline = usePlugin(filter, 'postcss', _options[fallback]);
                        break;

                    // rem
                    case 'rem':
                        pipeline = usePlugin(rem, 'postcss', _options[fallback]);
                        break;

                    // pseudo-elements
                    case 'pseudoElements':
                        pipeline = usePlugin(pseudoElements, 'processor');

                }

            }

        }

    }

    // mqpacker
    if (config.optimizers.mqpacker) {
        pipeline = usePlugin(mqpacker, 'processor');
    }

    // prefixer
    _options = config.fallbacks.autoprefixer;
    if (_options) {
        pipeline = usePlugin(prefixer, 'postcss', _options);
    }

    // minifier
    if (config.optimizers.minifier) {
        pipeline = usePlugin(minifier, 'processor');
    }

    // sourcemaps
    var sourcemaps = false;
    var postCSSOptions = {};
    _options = config.sourcemaps;
    if (_options) {
        if (_options === true) {
            // default: create inline sourcemaps
            postCSSOptions = {
                map: 'inline',
                to: config.out
            };
            sourcemaps = false;
        } else if (typeof _options === 'object') {
            // create sourcemaps with options
            postCSSOptions = _options;
            // then it'll be ok to return sourcemaps object
            sourcemaps = true;
        }
    }

    // process styles
    var result = pipeline.process(css, postCSSOptions);

    // return result.css and/or result.map
    if (sourcemaps) {
        return result;
    } else {
        return result.css;
    }

};


/**
 *
 * New Pleeease instance
 *
 */
var pleeease = function(options) {
    return new Pleeease(options);
};
pleeease.process = function(css, options) {
    return new Pleeease(options).process(css);
};

/**
 *
 * Exports
 *
 */
module.exports = pleeease;