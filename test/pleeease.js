'use strict';
var pleeease   = require('../lib/pleeease'),
    Options    = require('../lib/options'),
    postcss    = require('postcss');
var minifier   = require('csswring');

var assert     = require('assert'),
    helpers    = require('../test/_helpers.js');

/**
 *
 * Describe Pleeease
 *
 */
describe('Pleeease', function () {

  var options = {};

  beforeEach(function() {
    options = new Options().options;
    options.minifier = false;
  });

  it('should process CSS as string', function () {
    pleeease.process('a{a:a}').should.eql('a{a:a}');
  });

  it('should process CSS as PostCSS AST', function () {
    var ast = postcss.parse('a{a:a}');
    pleeease.process(ast).should.eql('a{a:a}');
  });

  it('should error when no arguments are given', function () {
    (function () {
      return pleeease.process();
    }).should.throw(/^CSS missing/);
  });

  it('should error when PostCSS fails parsing CSS', function () {
    (function () {
      return pleeease.process(true);
    }).should.throwError;
    (function () {
      return pleeease.process({});
    }).should.throwError;
  });

  it('should process CSS string with options', function () {
    pleeease.process('a{}', {minifier: false}).should.eql('a{}');
  });

  it('should use filename from `sourcemaps.from` option', function () {
    var file = 'in.css';
    var map = pleeease.process('a{a:a}', {sourcemaps: {map: {inline: false}, from: file}}).map;
    map._file.should.eql(file);
  });

  it('can be used as a plugin', function () {
    assert.equal(postcss().use(pleeease).process('a{a: a}').css, 'a{a:a}');
  });

  it('accepts options when use as a plugin', function () {
    assert.equal(postcss().use(pleeease({minifier: false})).process('a{a: a}').css, 'a{a: a}');
    assert.equal(postcss().use(pleeease({minifier: true})).process('a{a: a}').css, 'a{a:a}');
  });

  it('can be piped with another module', function () {
    assert.equal(postcss().use(pleeease({minifier: false})).use(minifier).process('a{a: a}').css, 'a{a:a}');
  });

  it('should create default inline sourcemaps', function () {

    options.sourcemaps = true;
    helpers.test('sourcemaps', options);

  });

  it('should return processed CSS as string when sourcemaps are disabled', function () {

    options.sourcemaps = false;
    var processed = pleeease.process('div { color: white }', options);

    assert.strictEqual(processed.map, undefined);
    assert.strictEqual(processed.css, undefined);
    assert('string' == typeof processed);

  });

  it('should return object result.map and result.css when sourcemaps are enabled', function () {

    options.sourcemaps = { map: {inline: false} };
    var processed = pleeease.process('div { color: white }', options);

    assert.notStrictEqual(processed.map, undefined);
    assert('object' == typeof processed.map);
    assert.notStrictEqual(processed.css, undefined);
    assert('string' == typeof processed.css);

  });

  it('should work in standalone version', function () {

    var json = require('../package.json');
    var version;
    for (var key in json) {
      if ('version' === key) {
        version = json[key];
        break;
      }
    }
    var standalone = require('../standalone/pleeease-' + version + '.min.js');
    var css      = helpers.readFile('test/features/filters.css');
    var expected = helpers.readFile('test/features/filters.out.css');
    options.autoprefixer = false;
    var result   = standalone.process(css, options);

    assert.equal(expected, result);

  });

});