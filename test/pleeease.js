'use strict';
var pleeease   = require('../lib/');
var assert     = require('assert');
var test       = require('../test/_helpers.js').test;
var readFile   = require('../test/_helpers.js').readFile;
var removeFile = require('../test/_helpers.js').removeFile;
var requireWithoutCache = require('../test/_helpers.js').requireWithoutCache;
/**
 *
 * Describe Pleeease
 *
 */
describe('Pleeease', function () {

  var options = {};

  beforeEach(function() {
    options = requireWithoutCache('../lib/options')().defaults;
    options.minifier = false;
  });

  it('should create default inline sourcemaps', function () {

    options.sourcemaps = true;
    test('sourcemaps', options);

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
    var css      = readFile('test/features/filters.css');
    var expected = readFile('test/features/filters.out.css');
    options.autoprefixer = false;
    var result   = standalone.process(css, options);

    assert.equal(expected, result);

  });

});