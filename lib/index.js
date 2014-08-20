'use strict';

/**
 *
 * Constructor Pleeease
 * @param {Object} options
 *
 */
var Pleeease = function (options) {

    var Options = require('../lib/options');
    console.log('----index---', options);
    this.opts   = Options().extend(options);
    console.log('----after---', this.opts);

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
        prefixer       = require('autoprefixer'),
        minifier       = require('csswring'),
        mqpacker       = require('css-mqpacker'),
        vars           = require('postcss-custom-properties'),
        rem            = require('pixrem'),
        filter         = require('pleeease-filters'),
        importer       = require('../lib/processors/import'),
        pseudoElements = require('../lib/processors/pseudoElements');

    var opts;

    var processors = [];
    var processorsFn = [
        (opts = this.opts.import)                ? importer(opts).processor : false,
        (opts = this.opts.next.customProperties) ? vars(opts)               : false,
        (opts = this.opts.filters)               ? filter(opts).postcss     : false,
        (opts = this.opts.rem)                   ? rem(opts).postcss        : false,
        (opts = this.opts.pseudoElements)        ? pseudoElements.processor : false,
        (opts = this.opts.mqpacker)              ? mqpacker.processor       : false,
        (opts = this.opts.autoprefixer)          ? prefixer(opts).postcss   : false,
        (opts = this.opts.minifier)              ? minifier.processor       : false
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
                map: 'inline',
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