'use strict';

/**
 *
 * Constructor Preprocessor
 * @param {String} css      CSS as string
 * @param {Object} opts     Options
 *
 */
var Preprocessor = function (css, opts) {
  this.css = css;
  this.sourcemaps = opts.sourcemaps;
  this.options = opts;
};

/**
 *
 * Sass
 *
 */
Preprocessor.prototype.sass = function () {
  var sass = require('node-sass');
  var opts = this.options.sass;

  // set specific options
  if (this.sourcemaps) {
    opts.file = this.sourcemaps.from;
    opts.outFile = this.sourcemaps.to;
  }
  opts.data = this.css;

  try {
    this.css = sass.renderSync(opts).css;
  } catch (err) {
    throw new Error(err);
  }

  return this.css;
};

/**
 *
 * LESS
 *
 */
Preprocessor.prototype.less = function () {
  var less = require('less');
  var opts = this.options.less;

  // set specific options
  if (this.sourcemaps) {
    opts.filename = this.sourcemaps.to;
  }

  var _this = this;

  less.render(this.css, opts, function (err, output) {
    if (err) {
      throw new Error(err);
    }
    _this.css = output.css;
  });

  return this.css;
};

/**
 *
 * Stylus
 *
 */
Preprocessor.prototype.stylus = function () {
  var stylus = require('stylus');
  var opts = this.options.stylus;

  // set specific options
  if (this.sourcemaps) {
    opts.filename = this.sourcemaps.to;
  }

  var _this = this;

  stylus.render(this.css, opts, function (err, output) {
    if (err) {
      throw new Error(err);
    }
    _this.css = output;
  });

  return this.css;
};

/**
 *
 * New Preprocessor instance
 *
 */
var preprocessor = function(css, filename, options) {
  return new Preprocessor(css, filename, options);
};

/**
 *
 * Exports
 *
 */
module.exports = preprocessor;