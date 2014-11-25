'use strict';

var fs          = require('fs');
var options     = require('../lib/options')().defaults;
var pleeease    = require('../lib/');
var assert      = require('assert');
var test        = require('../test/_helpers.js').test;
var __features  = require('../test/_helpers.js').dirname['features'];

/**
 *
 * Describe Features
 *
 */
describe('Features', function () {

  var opts;

  beforeEach(function() {
    opts = {};
    opts.minifier = false;
  });

  describe('Prefixes', function () {

    it('should generate -webkit- prefixes for calc() (support iOS6)', function () {

      // options
      opts.autoprefixer = {browsers: ['iOS 6']};
      test('prefixes', opts);

    });

  });

  describe('rem', function () {

    it('should add fallback for rem unit', function () {

      test('rem', opts);

    });

    it('should convert rem using config', function () {

      // options
      opts.rem = ['10px', {replace: true}];
      test('rem.2', opts);

    });

  });

  describe('Pseudo-elements', function () {

    it('should replace pseudo-elements syntax', function () {

      test('pseudoElements', opts);

    });

  });

  describe('Filters', function () {

    it('should convert CSS filters to SVG', function () {

      // options
      opts.autoprefixer = false;
      test('filters', opts);

    });

    it('should not convert CSS filters to SVG when asked', function () {

      // options
      opts.autoprefixer = false;
      opts.filters = false;
      opts.same = true;

      test('filters', opts);

    });

    it('should add IE filters when asked', function () {

      // options
      opts.autoprefixer = false;
      opts.filters = { oldIE: true };
      opts.same = false;
      test('filters-ie', opts);

    });

  });

  describe('Opacity', function () {

    it('should convert opacity into filter', function () {

      // options
      test('opacity', opts);

    });

  });

  describe('MQs', function () {

    it('should combine media-queries', function () {

      // options
      opts.minifier = true;
      opts.mqpacker = true;
      test('mq', opts);

    });

  });

  describe('Imports', function () {

    it('should combine files with imports', function() {
      var compile = function (inputs, options) {
        // get inputs files
        var CSS = inputs.map(function(input) {
          return fs.readFileSync(input).toString();
        });
        // options
        opts.autoprefixer = true;
        opts.minifier = true;
        opts.mqpacker = true;
        opts.import = {path: __features};
        // fixed CSS
        return pleeease.process(CSS.join('\n'), opts);
      };

      opts.in = [__features + 'import.css', __features + 'mq.css'];

      // process
      var processed = compile(opts.in, opts);
      var expected = fs.readFileSync(__features + 'import.out.css').toString();

      assert.equal(processed,expected);
    });

  });

  describe('Minifier', function () {

    it('should minify when asked', function() {
      //css
      var css = '.elem {\n' +
              'color: #f39;\n' +
          '}';
      var expected = '.elem{color:#f39}';
      // options
      opts.minifier = true;
      // process
      var processed = pleeease.process(css, opts);

      assert.equal(processed, expected);

    });

    it('should minify all possible features', function() {

      // options
      opts.autoprefixer = false;
      opts.minifier = true;
      opts.filters = { oldIE: true };
      test('minifier', opts);

    });

    it('should keep hacks', function() {
      //css
      var css = 'a{_color:#000}';
      // options
      opts.minifier = true;
      // process
      var processed = pleeease.process(css, opts);

      assert.equal(processed, css);

    });

  });

  describe('NEXT', function () {

    it('should combined all postprocessors', function () {

      // options
      opts.autoprefixer = {browsers: ['iOS 6']};
      opts.next = true;
      test('next', opts);

    });

    it('should minify correctly', function () {

      // options
      opts.autoprefixer = false;
      opts.minifier = true;
      opts.next = true;

      var css = fs.readFileSync(__features + 'next.css', 'utf-8');
      var expected = fs.readFileSync(__features + 'next.minify.out.css', 'utf-8');

      // process
      var processed = pleeease.process(css, opts);

      assert.equal(processed, expected);

    });

    describe('Options', function () {

      it('should not evaluate any by default', function () {

        // options
        opts.autoprefixer = false;
        opts.same = true;
        test('next.options', opts);

      });

      it('should evaluate only one when asked', function () {

        // options
        opts.autoprefixer = false;
        opts.next = {customProperties: true};
        test('next.options', opts);

      });

    });

  });

});
