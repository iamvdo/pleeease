'use strict';

var fs          = require('fs');
var options     = require('../lib/options')().defaults;
var pleeease    = require('../lib/');
var assert      = require('assert');

var dirname = 'test/preprocessors/';
/**
 *
 * Describe Features
 *
 */
describe('Preprocessors', function () {

  var opts;

  beforeEach(function() {
    opts = {};
    opts.minifier = true;
  });

  describe('Sass', function () {

    beforeEach(function() {
      opts.sass = true;
    });

    it('should compile using Sass', function () {

      var css      = fs.readFileSync(dirname + 'sass/preproc.scss', 'utf-8');
      var expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');

      var processed = pleeease.process(css, opts);

      assert.equal(processed, expected);

    });

    it('should import files', function () {

      var css      = fs.readFileSync(dirname + 'sass/import.scss', 'utf-8');
      var expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');

      opts.sass = {
        includePaths: ['test/preprocessors/sass']
      };
      var processed = pleeease.process(css, opts);

      assert.equal(processed, expected);

    });

  });

  describe('LESS', function () {

    beforeEach(function() {
      opts.less = {};
    });

    it('should compile using LESS', function () {

      var css      = fs.readFileSync(dirname + 'less/preproc.less', 'utf-8');
      var expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');

      var processed = pleeease.process(css, opts);

      assert.equal(processed, expected);

    });

    it('should import files', function () {

      var css      = fs.readFileSync(dirname + 'less/import.less', 'utf-8');
      var expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');

      opts.less.paths = ['test/preprocessors/less'];
      var processed = pleeease.process(css, opts);

      assert.equal(processed, expected);

    });

  });

  describe('Stylus', function () {

    beforeEach(function() {
      opts.stylus = true;
    });

    it('should compile using Stylus', function () {

      var css      = fs.readFileSync(dirname + 'stylus/preproc.styl', 'utf-8');
      var expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');

      var processed = pleeease.process(css, opts);

      assert.equal(processed, expected);

    });

    it('should import files', function () {

      var css      = fs.readFileSync(dirname + 'stylus/import.styl', 'utf-8');
      var expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');

      opts.stylus = {
        paths: ['test/preprocessors/stylus']
      };
      var processed = pleeease.process(css, opts);

      assert.equal(processed, expected);

    });

  });

/*
  it('should import files using preprocessor', function () {

    var scss     = fs.readFileSync(dirname + 'import.scss', 'utf-8');
    var expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');

    opts.sass = {
      includePaths: ['test/preproc']
    };
    var processed = pleeease.process(scss, opts);

    assert.equal(processed, expected);

  });

  it('should process plain ol\' CSS', function () {

    var scss     = fs.readFileSync(dirname + 'css.css', 'utf-8');
    var expected = fs.readFileSync(dirname + 'css.out.css', 'utf-8');

    // set pleeease import, not sass
    opts.import = {path: 'test/preproc'};

    var processed = pleeease.process(scss, opts);

    assert.equal(processed, expected);

  });

  it('should generates and updates sourcemaps', function () {

    var scss     = fs.readFileSync('test/preproc/sourcemaps.scss', 'utf-8');
    var expected = fs.readFileSync('test/preproc/sourcemaps.out.css', 'utf-8');

    // set prefixes for all browsers
    opts.autoprefixer = { browsers: ['last 99 versions'] };
    // set sourcemaps
    opts.sourcemaps = true;
    var processed = pleeease.process(scss, opts);

    assert.equal(processed, expected);

  });
  */


});