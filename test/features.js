'use strict';

var fs          = require('fs');
var pleeease    = require('../lib/pleeease');
var test        = require('../test/_helpers.js').test;
var __features  = require('../test/_helpers.js').dirname.features;

/**
 *
 * Describe Features
 *
 */
describe('Postprocessors', function () {

  var opts;

  beforeEach(function() {
    opts = {};
    opts.minifier = false;
  });

  describe('Features', function () {

    var optsFeatures = {
      autoprefixer: {autoprefixer: {browsers: ['iOS 6']}},
      filters     : {autoprefixer: false},
      filtersIE   : {autoprefixer: false, filters: {oldIE: true}},
      mqpacker    : {mqpacker: true},
      remopts     : {rem: ['10px', {replace: true}]}
    };

    function _test (feature, sub) {
      var opt = {};
      sub = sub || '';
      // test with feature
      if (optsFeatures[feature + sub]) {
        opt = optsFeatures[feature + sub];
      }
      opt.minifier = opt.minifier || false;
      test(feature + sub, opt);
      // test without feature
      opt[feature] = false;
      opt.same = true;
      test(feature + sub, opt);
    }

    it('adds prefixes'                 , function () { _test('autoprefixer');   });
    it('adds rem fallback'             , function () { _test('rem');            });
    it('adds rem fallback with options', function () { _test('rem', 'opts');    });
    it('replaces pseudo-elements'      , function () { _test('pseudoElements'); });
    it('converts CSS filters'          , function () { _test('filters');        });
    it('adds IE filters'               , function () { _test('filters', 'IE');  });
    it('adds vmin'                     , function () { _test('vmin');           });
    it('converts opacity into filter'  , function () { _test('opacity');        });
    it('combines media-queries'        , function () { _test('mqpacker');       });

  });

  describe('Imports', function () {

    it('combines files with imports', function() {
      var compile = function (inputs) {
        var CSS = inputs.map(function(input) {
          return fs.readFileSync(input).toString();
        });
        opts.autoprefixer = true;
        opts.minifier = true;
        opts.mqpacker = true;
        opts.import = {path: __features};
        // fixed CSS
        return pleeease.process(CSS.join('\n'), opts);
      };
      var inputs = [__features + 'import.css', __features + 'mqpacker.css'];
      // process
      var processed = compile(inputs);
      var expected = fs.readFileSync(__features + 'import.out.css').toString();
      processed.should.eql(expected);
    });

    it('does not import when false', function () {
      opts.import = false;
      opts.same = true;
      test('import', opts);
    });

    it('rebases urls', function () {
      opts.minifier = true;
      opts.import   = {path: 'test/features'};
      var _in      = fs.readFileSync('test/features/url.css', 'utf-8');
      var expected = fs.readFileSync('test/features/url.out.css', 'utf-8');
      var processed = pleeease.process(_in, opts);
      processed.should.eql(expected);
    });

    it('does not rebase when false', function () {
      opts.minifier = true;
      opts.import   = {path: 'test/features'};
      opts.rebaseUrls = false;
      var _in      = fs.readFileSync('test/features/url.css', 'utf-8');
      var expected = fs.readFileSync('test/features/url.3.out.css', 'utf-8');
      var processed = pleeease.process(_in, opts);
      processed.should.eql(expected);
    });

    it('rebases urls uses `out` or `sourcemaps.to` option', function () {
      opts.minifier = true;
      opts.out = 'test/features/url.out.css';
      opts.import   = {path: 'test/features'};
      var _in      = fs.readFileSync('test/features/url.css', 'utf-8');
      var expected = fs.readFileSync('test/features/url.2.out.css', 'utf-8');
      var processed = pleeease.process(_in, opts);
      processed.should.eql(expected);

      opts.sourcemaps = {to: opts.out};
      delete opts.out;
      processed = pleeease.process(_in, opts);
      processed.should.eql(expected);
    });

  });

  describe('Minifier', function () {

    it('minifies when asked', function() {
      var css = '.elem {\n' +
              'color: #f39;\n' +
          '}';
      var expected = '.elem{color:#f39}';
      opts.minifier = true;
      var processed = pleeease.process(css, opts);
      processed.should.eql(expected);
    });

    it('minifies all possible features', function() {
      opts.autoprefixer = false;
      opts.minifier = true;
      opts.filters = {oldIE: true};
      test('minifier', opts);
    });

    it('keeps hacks', function() {
      var css = 'a{_color:#000}';
      opts.minifier = true;
      var processed = pleeease.process(css, opts);
      processed.should.eql(css);
    });

  });

  describe('NEXT', function () {

    it('doesn\'t apply by default', function () {
      opts.autoprefixer = false;
      opts.same = true;
      test('next', opts);
    });

    it('applies all postprocessors', function () {
      opts.autoprefixer = {browsers: ['iOS 6.1']};
      opts.next = true;
      test('next', opts);
    });

    it('applies only one feature when asked', function () {
        opts.autoprefixer = false;
        opts.next = {customProperties: true};
        test('next.options', opts);
      });

    it('minifies correctly', function () {
      opts.autoprefixer = false;
      opts.minifier = true;
      opts.next = true;
      var css = fs.readFileSync(__features + 'next.css', 'utf-8');
      var expected = fs.readFileSync(__features + 'next.minify.out.css', 'utf-8');
      var processed = pleeease.process(css, opts);
      processed.should.eql(expected);
    });

  });

});
