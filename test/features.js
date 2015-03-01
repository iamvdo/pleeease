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
describe('Postprocessors features', function () {

  var opts;

  beforeEach(function() {
    opts = {};
    opts.minifier = false;
  });

  describe('autoprefixer', function () {

    it('generates -webkit- prefixes for calc() (support iOS6)', function () {
      opts.autoprefixer = {browsers: ['iOS 6']};
      test('prefixes', opts);
    });

  });

  describe('rem', function () {

    it('adds fallback for rem unit', function () {
      test('rem', opts);
    });

    it('converts rem using config', function () {
      opts.rem = ['10px', {replace: true}];
      test('rem.2', opts);
    });

  });

  describe('Pseudo-elements', function () {

    it('replaces pseudo-elements syntax', function () {
      test('pseudoElements', opts);
    });

  });

  describe('Filters', function () {

    it('converts CSS filters to SVG', function () {
      opts.autoprefixer = false;
      test('filters', opts);
    });

    it('doesn\'t convert CSS filters to SVG when asked', function () {
      opts.autoprefixer = false;
      opts.filters = false;
      opts.same = true;
      test('filters', opts);
    });

    it('adds IE filters when asked', function () {
      opts.autoprefixer = false;
      opts.filters = {oldIE: true};
      opts.same = false;
      test('filters-ie', opts);
    });

  });

  describe('Opacity', function () {

    it('converts opacity into filter', function () {
      test('opacity', opts);
    });

  });

  describe('MQs', function () {

    it('combines media-queries', function () {
      opts.minifier = true;
      opts.mqpacker = true;
      test('mq', opts);
    });

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
      opts.in = [__features + 'import.css', __features + 'mq.css'];
      // process
      var processed = compile(opts.in);
      var expected = fs.readFileSync(__features + 'import.out.css').toString();
      processed.should.eql(expected);
    });

    it('rebases urls', function () {
      opts.minifier = true;
      opts.import   = {path: 'test/features'};
      var _in      = fs.readFileSync('test/features/url.css', 'utf-8');
      var expected = fs.readFileSync('test/features/url.out.css', 'utf-8');
      var processed = pleeease.process(_in, opts);
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
