'use strict';

var Options      = require('../lib/options');
var Preprocessor = require('../lib/preprocessor');

require('es6-promise').polyfill();
var postcss = require('postcss');

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
  var filter         = require('pleeease-filters');
  var rem            = require('pixrem');
  var vmin           = require('postcss-vmin');
  var pseudoElements = require('postcss-pseudoelements');
  var opacity        = require('postcss-opacity');
  var mqpacker       = require('css-mqpacker');
  var prefixer       = require('autoprefixer-core');
  var minifier       = require('csswring');

  var opts;

  var processors = [];
  var processorsFn = [
    (opts = this.options.import)                ? importer(opts)                : false,
    (opts = this.options.rebaseUrls)            ? urlifier()                    : false,
    (opts = this.options.filters)               ? filter(opts).postcss          : false,
    (opts = this.options.rem)                   ? rem.apply(null, opts).postcss : false,
    (opts = this.options.vmin)                  ? vmin()                        : false,
    (opts = this.options.pseudoElements)        ? pseudoElements()              : false,
    (opts = this.options.opacity)               ? opacity()                     : false,
    (opts = this.options.mqpacker)              ? mqpacker.postcss              : false,
    (opts = this.options.autoprefixer)          ? prefixer(opts)                : false,
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
 * Process stylesheet (parse, then process)
 * @param  {String} css
 * @return {Promise}
 *
 */
Pleeease.prototype.process = function (css) {

  var processor = this;
  var opts = processor.options;

  return new Promise(function (resolve, reject) {
    if (!css) {
      reject(new Error('CSS missing in pleeease.process()'));
    }
    try {
      resolve(processor.parse(css));
    } catch (err) {
      reject(err);
    }
  })
  .then(function (parsed) {
    return processor.plugin(parsed);
  })
  .then(function (result) {
    if (opts.sourcemaps && (opts.sourcemaps.map && !opts.sourcemaps.map.inline)) {
      return result;
    }
    return result.css;
  })
  .catch(function (error) {
    throw error;
  });

};

/**
 *
 * Plugin method (process css using postcss)
 * @param  {String} css
 * @return {Promise}
 *
 */
Pleeease.prototype.plugin = function (css) {

  var processor = this;
  var opts = processor.options;

  return postcss(processor.processors).process(css, opts.sourcemaps)
  .then(function (result) {
    return result;
  })
  .catch(function (error) {
    throw error;
  });

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
var plugin = postcss.plugin('pleeease', function (options) {
  return function (css, result) {
    return new Pleeease(options).plugin(css);
  };
});
plugin.process = function (css, options) {
  return new Pleeease(options).process(css);
};
plugin.processor = function (options) {
  return new Pleeease(options);
};

/**
 *
 * Exports
 *
 */
module.exports = plugin;
