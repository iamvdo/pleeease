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


  it('should compile using Sass', function () {

    opts.sass = true;

    var css      = fs.readFileSync(dirname + 'preproc.scss', 'utf-8');
    var expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');

    var processed = pleeease.process(css, opts);

    assert.equal(processed, expected);

  });

  it('should compile using LESS', function () {

    opts.less = true;

    var css      = fs.readFileSync(dirname + 'preproc.less', 'utf-8');
    var expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');

    var processed = pleeease.process(css, opts);

    assert.equal(processed, expected);

  });

  it('should compile using Stylus', function () {

    opts.stylus = true;

    var css      = fs.readFileSync(dirname + 'preproc.styl', 'utf-8');
    var expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');

    var processed = pleeease.process(css, opts);

    assert.equal(processed, expected);

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