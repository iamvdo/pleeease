'use strict';

/**
 *
 * Constructor Pleeease
 * @param {Object} options
 *
 */
var Pleeease = function (options) {

    var Options = require('../lib/options');
    this.opts   = new Options().extend(options);

};

/**
 *
 * Process stylesheet (chain and apply all postprocessors)
 * @param  {String} css
 * @return {String|Object} Processed css as String or Object.css|Object.map if sourcemaps is true
 *
 */
Pleeease.prototype.process = function (css) {

    var postcss        = require('postcss'),
        importer       = require('postcss-import'),
        media          = require('postcss-custom-media'),
        vars           = require('postcss-custom-properties'),
        calc           = require('postcss-calc'),
        color          = require('postcss-color'),
        filter         = require('pleeease-filters'),
        rem            = require('pixrem'),
        pseudoElements = require('../lib/processors/pseudoElements'),
        opacity        = require('../lib/processors/opacity'),
        mqpacker       = require('css-mqpacker'),
        prefixer       = require('autoprefixer-core'),
        minifier       = require('csswring');

    var opts;

    var processors = [];
    var processorsFn = [
        (opts = this.opts.import)                ? importer(opts)                : false,
        (opts = this.opts.next.customMedia)      ? media()                       : false,
        (opts = this.opts.next.customProperties) ? vars(opts)                    : false,
        (opts = this.opts.next.calc)             ? calc()                        : false,
        (opts = this.opts.next.colors)           ? color()                       : false,
        (opts = this.opts.filters)               ? filter(opts).postcss          : false,
        (opts = this.opts.rem)                   ? rem.apply(null, opts).postcss : false,
        (opts = this.opts.pseudoElements)        ? pseudoElements.processor      : false,
        (opts = this.opts.opacity)               ? opacity.processor             : false,
        (opts = this.opts.mqpacker)              ? mqpacker.processor            : false,
        (opts = this.opts.autoprefixer)          ? prefixer(opts).postcss        : false,
        (opts = this.opts.minifier)              ? minifier(opts).postcss        : false
    ];

    // remove false
    processorsFn.forEach(function (processor) {
        if (processor) {
            processors.push(processor);
        }
    });

    // sourcemaps
    var sourcemaps = false;
    var postCSSOptions = {};
    opts = this.opts.sourcemaps;
    if (opts) {
        if (opts === true) {
            // default: create inline sourcemaps
            postCSSOptions = {
                map: true,
                to: this.opts.out
            };
            sourcemaps = false;
        } else if (typeof opts === 'object') {
            // create sourcemaps with options
            postCSSOptions = opts;
            // then it'll be ok to return sourcemaps object
            sourcemaps = true;
        }
    }

    var pipeline = postcss();

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