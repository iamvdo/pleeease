'use strict';
var options  = require('../lib/options');
var pleeease = require('../lib/');
var assert   = require('assert');
var test     = require('../test/_helpers.js').test;

/**
 *
 * Describe Pleeease
 *
 */
describe('Pleeease', function () {

  beforeEach(function() {
    options.optimizers.minifier = false;
  });

  it('should create default inline sourcemaps', function () {

    options.sourcemaps = {
                map:  'inline',
                from: 'from.css',
                to:   'to.css'
            };
    test('sourcemaps');

  });

  it('should return processed CSS as string when sourcemaps are disabled', function () {

    options.sourcemaps = false;
    var processed = pleeease.process('div { color: white }', options);

    assert.strictEqual(processed.map, undefined);
    assert.strictEqual(processed.css, undefined);
    assert('string' == typeof processed);

  });

  it('should return object result.map and result.css when sourcemaps are enabled', function () {

    options.sourcemaps = { map: true };
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
    var css = 'a{color:#FFF}';
    var expected = standalone.process(css);

    assert.equal(expected, css);

  });

});