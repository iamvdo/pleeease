'use strict';

/**
 *
 * Constructor Preprocessor
 * @param {String} css      CSS as string
 * @param {String} filename Filename of CSS file
 * @param {Object} options  Options
 *
 */
var Preprocessor = function (css, filename, options) {
  this.css = css;
  this.filename = filename;
  this.options = options;
};

/**
 *
 * Sass
 *
 */
Preprocessor.prototype.sass = function () {
  var sass = require('node-sass');
  var opts = this.options.sass;
  opts.data = this.css;

  this.css = sass.renderSync(opts).css;

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
  opts.filename = this.filename;

  // set sourcemaps
  opts = this.setSourcemapsOptions('less', this.options);

  var _this = this;

  less.render(this.css, opts, function (err, output) {
    if (err) {
      console.log('Pleeease'.pleeease, 'LESS'.error, 'Compilation failed: '.error + err.message.error);
      return;
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
  opts.filename = this.filename;

  // set sourcemaps
  opts = this.setSourcemapsOptions('stylus', this.options);

  var _this = this;

  stylus.render(this.css, opts, function (err, output) {
    _this.css = output;
  });

  return this.css;
};

/**
 *
 * Set Sourcemaps
 *
 */
Preprocessor.prototype.setSourcemapsOptions = function (type, opts) {

  if ('less' === type) {
    if (opts.sourcemaps || opts.less.sourceMap) {
      opts.less.sourceMap = {
        sourceMapFileInline: true
      };
    }
    this.options = opts;
    opts = opts.less;
  }
  else if ('stylus' === type) {
    if (opts.sourcemaps || opts.stylus.sourcemap) {
      opts.stylus.sourcemap = {
        'inline': true
      };
    }
    this.options = opts;
    opts = opts.stylus;
  }

  return opts;
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