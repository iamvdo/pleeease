'use strict';

var postcss        = require('postcss'),
    prefixer       = require('autoprefixer'),
    minifier       = require('csswring'),
    mqpacker       = require('css-mqpacker'),
    vars           = require('postcss-custom-properties'),
    rem            = require('pixrem'),
    filter         = require('pleeease-filters'),
    importer       = require('../lib/processors/import'),
    pseudoElements = require('../lib/processors/pseudoElements'),
    extend         = require('deep-extend');

var pipeline;

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
    this.config = extend(defaults, options);

};

/**
 *
 * Process stylesheet (chain and apply all postprocessors)
 * @param  {String} css
 * @return {String|Object} Processed css as String or Object.css|Object.map if sourcemaps is true
 *
 */
Pleeease.prototype.process = function (css) {

    var opts;

    // initialize the pipeline
    pipeline = postcss();

    var processors = [];

    // importer
    opts = this.config.optimizers.import;
    if (opts) {
        if (opts === true) {
            opts = process.cwd();
        }
        processors.push(importer(opts).processor);
    }

    // fallbacks
    opts = this.config.fallbacks;
    if (opts) {

        for (var fallback in opts) {

            if (opts.hasOwnProperty(fallback) && opts[fallback] !== false) {

                switch (fallback) {

                    // variables
                    case 'variables':
                        if (opts[fallback] === true) {
                            opts[fallback] = {};
                        }
                        processors.push(vars(opts[fallback]));
                        break;

                    // filters
                    case 'filters':
                        if (opts[fallback] === true) {
                            opts[fallback] = {};
                        }
                        processors.push(filter(opts[fallback]).postcss);
                        break;

                    // rem
                    case 'rem':
                        if (opts[fallback] === true) {
                            opts[fallback] = {};
                        }
                        processors.push(rem(opts[fallback]).postcss);
                        break;

                    // pseudo-elements
                    case 'pseudoElements':
                        processors.push(pseudoElements.processor);
                }

            }

        }

    }

    // mqpacker
    if (this.config.optimizers.mqpacker) {
        processors.push(mqpacker.processor);
    }

    // prefixer
    opts = this.config.fallbacks.autoprefixer;
    if (opts) {
        if (opts === true) {
            opts = [];
        }
        processors.push(prefixer(opts).postcss);
    }

    // minifier
    if (this.config.optimizers.minifier) {
        processors.push(minifier.processor);
    }

    // sourcemaps
    var sourcemaps = false;
    var postCSSOptions = {};
    opts = this.config.sourcemaps;
    if (opts) {
        if (opts === true) {
            // default: create inline sourcemaps
            postCSSOptions = {
                map: 'inline',
                to: this.config.out
            };
            sourcemaps = false;
        } else if (typeof opts === 'object') {
            // create sourcemaps with options
            postCSSOptions = opts;
            // then it'll be ok to return sourcemaps object
            sourcemaps = true;
        }
    }

    processors.forEach(pipeline.use.bind(pipeline));

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