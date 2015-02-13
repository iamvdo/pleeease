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

  // set sourcemaps
  opts = this.setSourcemapsOptions('sass', this.options);

  // set specific options
  opts.file = this.filename;
  opts.data = this.css;
  opts.outFile = this.options.out;

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

  // set sourcemaps
  opts = this.setSourcemapsOptions('less', this.options);

  // set specific options
  opts.filename = this.filename;

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

  // set sourcemaps
  opts = this.setSourcemapsOptions('stylus', this.options);

  // set specific options
  opts.filename = this.filename;

  var _this = this;

  stylus.render(this.css, opts, function (err, output) {
    if (err) {
      throw err;
    }
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

  function forceGlobalSourcemaps (opt) {
    if (opt) {
      opts.sourcemaps = true;
    }
  }

  if ('sass' === type) {
    // force global sourcemaps
    forceGlobalSourcemaps(opts.sass.sourceMap);
    if (opts.sourcemaps) {
      opts.sass.sourceMap = true;
      opts.sass.sourceMapEmbed = true;
    }
    this.options = opts;
    opts = opts.sass;
  }
  else if ('less' === type) {
    // force global sourcemaps
    forceGlobalSourcemaps(opts.less.sourceMap);
    if (opts.sourcemaps) {
      opts.less.sourceMap = {
        sourceMapFileInline: true
      };
    }
    this.options = opts;
    opts = opts.less;
  }
  else if ('stylus' === type) {
    // force global sourcemaps
    forceGlobalSourcemaps(opts.stylus.sourcemap);
    if (opts.sourcemaps) {
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