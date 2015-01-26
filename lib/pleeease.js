'use strict';

var Options      = require('../lib/options');
var Preprocessor = require('../lib/preprocessor');
var postcss      = require('postcss');

/**
 *
 * Constructor Pleeease
 * @param {Object} options
 *
 */
var Pleeease = function (options) {

    this.options = new Options().extend(options);

};

/**
 *
 * Parse stylesheets
 * @param  {String} css
 * @param  {String} filename
 * @return {Object} PostCSS AST
 *
 */
Pleeease.prototype.parse = function (css, filename) {

    if (this.options.sass || this.options.less || this.options.stylus) {
        var preprocess = new Preprocessor(css, filename, this.options);

        // Sass
        var opts = this.options.sass;
        if (opts) {
            css = preprocess.sass();
        }

        // LESS
        opts = this.options.less;
        if (opts) {
            css = preprocess.less();
        }

        // Stylus
        opts = this.options.stylus;
        if (opts) {
            css = preprocess.stylus();
        }
    }

    var postCSSoptions = {
        map: true,
        from: filename
    };

    var fileAst = postcss.parse(css, postCSSoptions);

    return fileAst;

};

/**
 *
 * Process stylesheet (chain and apply all postprocessors)
 * @param  {String} css
 * @return {String|Object} Processed css as String or Object.css|Object.map if sourcemaps is true
 *
 */
Pleeease.prototype.process = function (css) {

    var importer       = require('postcss-import'),
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
        (opts = this.options.import)                ? importer(opts)                : false,
        (opts = this.options.next.customMedia)      ? media()                       : false,
        (opts = this.options.next.customProperties) ? vars(opts)                    : false,
        (opts = this.options.next.calc)             ? calc()                        : false,
        (opts = this.options.next.colors)           ? color()                       : false,
        (opts = this.options.filters)               ? filter(opts).postcss          : false,
        (opts = this.options.rem)                   ? rem.apply(null, opts).postcss : false,
        (opts = this.options.pseudoElements)        ? pseudoElements.processor      : false,
        (opts = this.options.opacity)               ? opacity.processor             : false,
        (opts = this.options.mqpacker)              ? mqpacker.postcss              : false,
        (opts = this.options.autoprefixer)          ? prefixer(opts).postcss        : false,
        (opts = this.options.minifier)              ? minifier(opts).postcss        : false
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
    opts = this.options.sourcemaps;
    if (opts) {
        if (opts === true) {
            // default: create inline sourcemaps
            postCSSOptions = {
                map: true,
                to: this.options.out
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
    // new Pleeease
    var processor = new Pleeease(options);
    // try to read input file from sourcemaps options
    var filename = (options.sourcemaps && options.sourcemaps.from) ? options.sourcemaps.from : '<no-source>';
    // parse CSS first, and create PostCSS AST
    css = processor.parse(css, filename);
    // process
    return processor.process(css);
};

/**
 *
 * Exports
 *
 */
module.exports = pleeease;