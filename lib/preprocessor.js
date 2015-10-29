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
    opts.file    = path.resolve(this.sourcemaps.from);
    opts.outFile = path.resolve(this.sourcemaps.to);
  }
  opts.data = this.css;

  var result;

  try {
    result = sass.renderSync(opts);
  } catch (err) {
    throw new Error('Sass: parsing fails, ' + err);
  }

  var css = result.css.toString();
  var map;

  if (result.map) {
    map = result.map.toString();
  }

  return {css: css, map: map};
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
  if (this.sourcemaps && this.sourcemaps.map) {
    opts.filename = this.sourcemaps.from;
    opts.sourceMap.sourceMapOutputFilename = this.sourcemaps.to;
    // get basepath and rootpath
    var from = path.resolve(this.sourcemaps.from);
    var to   = path.resolve(this.sourcemaps.to);
    var absPath = require('commondir')([from, to]);
    var basepath = path.relative(process.cwd(), absPath);
    opts.sourceMap.sourceMapBasepath = opts.sourceMap.sourceMapBasepath || basepath;
    var rootpath = path.relative(path.dirname(this.sourcemaps.to), opts.sourceMap.sourceMapBasepath);
    opts.sourceMap.sourceMapRootpath = opts.sourceMap.sourceMapRootpath || rootpath;
  }

  var _this = this;

  less.render(this.css, opts, function (err, output) {
    if (err) {
      throw new Error('LESS: parsing fails, ' + err);
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

  var _this = this;

  var styl = stylus(_this.css, opts);
  styl.render(function (err, output) {
    if (err) {
      throw new Error('Stylus: parsing fails, ' + err);
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
