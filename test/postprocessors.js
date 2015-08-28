'use strict';

var fs          = require('fs');
var pleeease    = require('../lib/pleeease');
var assert       = require('assert');

var dirname = 'test/features/';

function test (key, opts, done) {
  // css
  var css = fs.readFileSync(dirname + key + '.css', 'utf-8');
  var expected = fs.readFileSync(dirname + key + '.out.css', 'utf-8');
  // process
  pleeease.process(css, opts).then(function (result) {
    assert.equal(result, expected);
    untest(css, done);
  }).catch(done);
}

function untest (css, done) {
  var Options = require('../lib/options')();
  for (var i in Options.options) {
    Options.options[i] = false;
  }
  pleeease.process(css, Options.options).then(function (result) {
    assert.equal(result, css);
    done();
  }).catch(done);
}

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
      import      : {import: {path: 'test/features/'}, minifier: true},
      filters     : {autoprefixer: false},
      remOpts     : {rem: ['10px', {replace: true}]},
      mqpacker    : {mqpacker: true},
      filtersIE   : {autoprefixer: false, filters: {oldIE: true}},
      sourcemaps  : {sourcemaps: true},
      autoprefixer: {autoprefixer: {browsers: ['iOS 6']}}
    };

    function _test (key, done) {
      var opts = {};
      if (optsFeatures[key]) {
        opts = optsFeatures[key];
      }
      opts.minifier = opts.minifier || false;
      test(key, opts, done);
    }

    it('adds prefixes'              , function (done) { _test('autoprefixer', done);   });
    it('adds rem fallback'          , function (done) { _test('rem', done);            });
    it('adds rem fallback with opts', function (done) { _test('remOpts', done);        });
    it('replaces pseudo-elements'   , function (done) { _test('pseudoElements', done); });
    it('converts CSS filters'       , function (done) { _test('filters', done);        });
    it('adds IE filters'            , function (done) { _test('filtersIE', done);      });
    it('adds vmin'                  , function (done) { _test('vmin', done);           });
    it('converts opacity'           , function (done) { _test('opacity', done);        });
    it('combines media-queries'     , function (done) { _test('mqpacker', done);       });
    it('imports files'              , function (done) { _test('import', done);         });
    it('adds inline sourcemaps'     , function (done) { _test('sourcemaps', done);     });

  });

  describe('Rebases', function () {

    var _in;

    beforeEach(function () {
      opts.minifier = true;
      opts.import   = {path: 'test/features'};
      _in = fs.readFileSync('test/features/url.css', 'utf-8');
    });

    it('rebases urls', function (done) {
      var expected = fs.readFileSync('test/features/url.out.css', 'utf-8');
      pleeease.process(_in, opts).then(function (result) {
        result.should.eql(expected);
        done();
      }).catch(done);
    });

    it('does not rebase when false', function (done) {
      opts.rebaseUrls = false;
      var expected = fs.readFileSync('test/features/url.3.out.css', 'utf-8');
      pleeease.process(_in, opts).then(function (result) {
        result.should.eql(expected);
        done();
      }).catch(done);
    });

    it('rebases urls uses `out` option', function (done) {
      opts.out = 'test/features/url.out.css';
      var expected = fs.readFileSync('test/features/url.2.out.css', 'utf-8');
      pleeease.process(_in, opts).then(function (result) {
        result.should.eql(expected);
        done();
      }).catch(done);
    });

    it('rebases urls uses `sourcemaps.to` option', function (done) {
      opts.sourcemaps = {to: 'test/features/url.out.css'};
      var expected = fs.readFileSync('test/features/url.2.out.css', 'utf-8');
      pleeease.process(_in, opts).then(function (result) {
        result.should.eql(expected);
        done();
      }).catch(done);
    });

  });

  describe('Minifier', function () {

    it('minifies when asked', function (done) {
      var css = '.elem {\n' +
              'color: #f39;\n' +
          '}';
      var expected = '.elem{color:#f39}';
      opts.minifier = true;
      pleeease.process(css, opts).then(function (result) {
        result.should.eql(expected);
        done();
      }).catch(done);
    });

    it('minifies all possible features', function (done) {
      opts.autoprefixer = false;
      opts.minifier = true;
      opts.filters = {oldIE: true};
      test('minifier', opts, done);
    });

    it('keeps hacks', function(done) {
      var css = 'a{_color:#000}';
      opts.minifier = true;
      pleeease.process(css, opts).then(function (result) {
        result.should.eql(css);
        done();
      }).catch(done);
    });

  });

});
