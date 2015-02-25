'use strict';

var Preprocessor = require('../lib/preprocessor');
var pleeease     = require('../lib/pleeease');
var fs           = require('fs');

var dirname = 'test/preprocessors/';

/**
 *
 * Describe Features
 *
 */
describe('Preprocessor', function () {

  var opts;

  beforeEach(function () {
    opts = {};
    opts.minifier = true;
  });

  describe('Processes plain ol\' CSS', function () {

    var css, expected, processed;

    beforeEach(function () {
      css      = fs.readFileSync(dirname + 'css.css', 'utf-8');
      expected = fs.readFileSync(dirname + 'css.out.css', 'utf-8');
      opts.import = {path: dirname};
    });

    afterEach(function () {
      processed = pleeease.process(css, opts);
      processed.should.eql(expected);
    });
    
    it('using Sass', function () {
      opts.sass = true;
    });
    it('using LESS', function () {
      opts.less = true;
    });
    it('using Stylus', function () {
      opts.stylus = true;
    });

  });

  describe('Compiles', function () {

    var css, expected, processed;

    beforeEach(function () {
      expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');
    });

    afterEach(function () {
      processed.should.eql(expected);
    });

    it('using Sass', function () {
      opts.sass = true;
      css       = fs.readFileSync(dirname + 'sass/preproc.scss', 'utf-8');
      processed = pleeease.process(css, opts);
    });
    it('using LESS', function () {
      opts.less = true;
      css       = fs.readFileSync(dirname + 'less/preproc.less', 'utf-8');
      processed = pleeease.process(css, opts);
    });
    it('using Stylus', function () {
      opts.stylus = true;
      css         = fs.readFileSync(dirname + 'stylus/preproc.styl', 'utf-8');
      processed   = pleeease.process(css, opts);
    });

  });

  describe('Imports', function () {

    var css, expected, processed;

    beforeEach(function () {
      expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');
    });

    afterEach(function () {
      processed.should.eql(expected);
    });

    it('files using Sass', function () {
      css       = fs.readFileSync(dirname + 'sass/import.scss', 'utf-8');
      opts.sass = {
        includePaths: ['test/preprocessors/sass']
      };
      processed = pleeease.process(css, opts);
    });
    it('files using LESS', function () {
      css       = fs.readFileSync(dirname + 'less/import.less', 'utf-8');
      opts.less = {
        paths: ['test/preprocessors/less']
      };
      processed = pleeease.process(css, opts);
    });
    it('files using Stylus', function () {
      css         = fs.readFileSync(dirname + 'stylus/import.styl', 'utf-8');
      opts.stylus = {
        paths: ['test/preprocessors/stylus']
      };
      processed = pleeease.process(css, opts);
    });

  });

  describe('Sourcemaps', function () {

    describe('generates good sourcemaps', function () {

      var css, expected, processed;
      var sourcemapLine   = 1;
      var sourcemapColumn = 541;

      beforeEach(function () {
        opts.browsers   = ["last 99 versions"];
        opts.sourcemaps = {map: {inline: false}};
        expected = fs.readFileSync(dirname + 'sourcemaps.out.css', 'utf-8');
      });

      afterEach(function () {
        var Map = require('source-map');
        var smc = new Map.SourceMapConsumer(processed.map.toJSON());
        var positions = smc.originalPositionFor({line: sourcemapLine, column: sourcemapColumn});
        positions.line.should.eql(31);
      })

      it('using Sass', function () {
        css       = fs.readFileSync(dirname + 'sass/sourcemaps.scss', 'utf-8');
        opts.sass = true;
        processed = pleeease.process(css, opts);
      });
      it('using LESS', function () {
        css       = fs.readFileSync(dirname + 'less/sourcemaps.less', 'utf-8');
        opts.less = true;
        processed = pleeease.process(css, opts);
      });
      it('using Stylus', function () {
        css      = fs.readFileSync(dirname + 'stylus/sourcemaps.styl', 'utf-8');
        opts.stylus = true;
        opts.sourcemaps.to = dirname + 'stylus/sourcemaps.styl';
        processed = pleeease.process(css, opts);
      });

    });

  });

});