'use strict';

var Options      = require('../lib/options');
var Processors   = require('../lib/processors');
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
  this.options = {};
  this.options = this.setOptions(options);
  this.processors = new Processors(this.options);

};

/**
 *
 * Parse stylesheets
 * @param  {String|Object} unprocessed - CSS in string form or AST
 * @return {Object} PostCSS AST
 *
 */
Pleeease.prototype.parse = function (unprocessed) {

  var opts = this.options;

  // Sass etc. don't understand AST format
  if (typeof unprocessed === 'string' && (opts.sass || opts.less || opts.stylus)) {
    var preprocess = new Preprocessor(unprocessed, opts);

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

    unprocessed = preprocess.css;
  }

  var sourcemaps = opts.sourcemaps;
  if (!sourcemaps) {
    sourcemaps = {
      map: false
    };
  }

  return postcss.parse(unprocessed, sourcemaps);
};

/**
 *
 * Process stylesheet (parse, then process)
 * @param  {String|Object} unprocessed
 * @return {Promise}
 *
 */
Pleeease.prototype.process = function (unprocessed) {

  var processor = this;
  var opts = processor.options;

  return new Promise(function (resolve, reject) {
    if (!unprocessed) {
      reject(new Error('CSS string or CSS AST data was not provided to pleeease.process()'));
    }
    try {
      resolve(processor.parse(unprocessed));
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
  return this.options;

};

/**
 *
 * New Pleeease instance
 *
 */
var plugin = postcss.plugin('pleeease', function (options) {
  return function (css) {
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
