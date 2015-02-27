'use strict';

var path = require('path');

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

  opts.sourceMapEmbed = false;

  try {
    this.css = sass.renderSync(opts);
  } catch (err) {
    throw new Error(err);
  }

  console.log('SASS', this.css.map);

  return {css: this.css.css, map: this.css.map};
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
    opts.filename = this.sourcemaps.from;
    opts.sourceMap.sourceMapFilename = this.sourcemaps.from;
    opts.sourceMap.sourceMapOutputFilename = this.sourcemaps.to;
    // get basepath and rootpath
    opts.sourceMap.sourceMapBasepath = require("common-dir")([this.sourcemaps.from, this.sourcemaps.to]);
    opts.sourceMap.sourceMapRootpath = path.relative(path.dirname(this.sourcemaps.to), opts.sourceMap.sourceMapBasepath);
  }

  opts.sourceMap.sourceMapFileInline = false;

  var _this = this;

  less.render(this.css, opts, function (err, output) {
    if (err) {
      throw new Error(err);
    }
    _this.css = output.css;
    _this.map = output.map;
  });

  return {css: this.css, map: this.map};
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
    opts.filename = this.sourcemaps.from;
    opts.dest = path.dirname(this.sourcemaps.to);
  }

  opts.sourcemap.inline = false;

  var _this = this;

  var styl = stylus(_this.css);
  styl.set('filename', opts.filename)
      .set('dest', opts.dest)
      .set('sourcemap', opts.sourcemap)
      .render(function (err, output) {
        if (err) {
          throw new Error(err);
        }
        _this.css = output;
        _this.map = styl.sourcemap;
      });

  return {css: this.css, map: this.map};
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