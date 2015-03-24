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

  options = options || {};

  this.defaults = new Options().defaults;
  this.setOptions(options);

  var importer       = require('postcss-import');
  var urlifier       = require('postcss-url');
  var media          = require('postcss-custom-media');
  var vars           = require('postcss-custom-properties');
  var calc           = require('postcss-calc');
  var color          = require('postcss-color');
  var filter         = require('pleeease-filters');
  var rem            = require('pixrem');
  var pseudoElements = require('postcss-pseudoelements');
  var opacity        = require('postcss-opacity');
  var mqpacker       = require('css-mqpacker');
  var prefixer       = require('autoprefixer-core');
  var minifier       = require('csswring');

  var opts;

  var processors = [];
  var processorsFn = [
    (opts = this.options.import)                ? importer(opts)                : false,
    (opts = this.options.import)                ? urlifier()                    : false,
    (opts = this.options.next.customMedia)      ? media()                       : false,
    (opts = this.options.next.customProperties) ? vars(opts)                    : false,
    (opts = this.options.next.calc)             ? calc()                        : false,
    (opts = this.options.next.colors)           ? color()                       : false,
    (opts = this.options.filters)               ? filter(opts).postcss          : false,
    (opts = this.options.rem)                   ? rem.apply(null, opts).postcss : false,
    (opts = this.options.pseudoElements)        ? pseudoElements()              : false,
    (opts = this.options.opacity)               ? opacity()                     : false,
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

  this.processors = processors;

  this.postcss = this.process.bind(this);

};

/**
 *
 * Parse stylesheets
 * @param  {String} css
 * @return {Object} PostCSS AST
 *
 */
Pleeease.prototype.parse = function (css) {

  var opts = this.options;

  if (opts.sass || opts.less || opts.stylus) {
    var preprocess = new Preprocessor(css, opts);
    // Sass
    if (opts.sass) {
      preprocess = preprocess.sass();
    }
    // LESS
    if (opts.less) {
      preprocess = preprocess.less();
    }
    // Stylus
    if (opts.stylus) {
      preprocess = preprocess.stylus();
    }
    // add previous map and switch from and to
    if (opts.sourcemaps) {
      if (opts.sourcemaps.map) {
        opts.sourcemaps.map.prev = preprocess.map;
      }
      opts.sourcemaps.from = opts.sourcemaps.to;
    }
    css = preprocess.css;
  }

  var sourcemaps = opts.sourcemaps;
  if (!sourcemaps) {
    sourcemaps = {
      map: false
    };
  }

  return postcss.parse(css, sourcemaps);

};

/**
 *
 * Pipe all modules
 * @return {Object} PostCSS pipeline
 *
 */
Pleeease.prototype.pipeline = function () {

  var pipeline = postcss();

  this.processors.forEach(function (processor) {
    pipeline.use(processor);
  });

  return pipeline;

};

/**
 *
 * Process stylesheet (chain and apply all postprocessors)
 * @param  {String} css
 * @return {String|Object} Processed css as String or Object.css|Object.map if sourcemaps is true
 *
 */
Pleeease.prototype.process = function (css) {

  var opts = this.options;

  var result = this.pipeline().process(css, opts.sourcemaps);

  // return result.css and/or result.map
  if (opts.sourcemaps && (opts.sourcemaps.map && !opts.sourcemaps.map.inline)) {
    return result;
  }
  return result.css;

};

/**
 *
 * Set new options in pleeease.options
 * @param {Object} opts
 *
 */
Pleeease.prototype.setOptions = function (opts) {

  var newOpts = new Options();
  // extend this.options
  newOpts.options = newOpts.extend(this.options);
  // extend specific
  newOpts.options = newOpts.extend(opts);
  this.options = newOpts.options;

};

/**
 *
 * New Pleeease instance
 *
 */
var pleeease = function (options) {
  return new Pleeease(options);
};
pleeease.postcss = function (css) {
  return new Pleeease().postcss(css);
};
pleeease.process = function (css, options) {

  if (arguments.length === 0) {
    throw new Error('CSS missing in pleeease.process()');
  }

  var processor = new Pleeease(options);

  try {
    // parse CSS first, then process it
    css = processor.parse(css);
    return processor.process(css);
  } catch (err) {
    throw new Error(err.message);
  }

};

/**
 *
 * Exports
 *
 */
module.exports = pleeease;
