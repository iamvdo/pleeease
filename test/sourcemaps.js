'use strict';
var pleeease   = require('../lib/pleeease'),
    Options    = require('../lib/options'),
    postcss    = require('postcss'),
    minifier   = require('csswring');
var sinon      = require('sinon');

var helpers    = require('../test/_helpers.js');

/**
 *
 * Describe Sourcemaps
 *
 */
describe('Sourcemaps', function () {

  var options = {};
  var spy = sinon.spy(pleeease, "process");

  beforeEach(function() {
    options = new Options().options;
    options.minifier = false;
  });

    it('uses default filenames if `from`/`to` are not set', function () {
      var from = '<no-source>';
      var to   = '<no-output>';
      options.sourcemaps = true;
      var fixed = pleeease.process('a{a:a}', options);
      var sourcemaps = spy.getCall(0).thisValue.processor.options.sourcemaps;
      sourcemaps.from.should.eql(from);
      sourcemaps.to.should.eql(to);
    });

    it('creates default inline sourcemaps', function () {
      options.sourcemaps = true;
      helpers.test('sourcemaps', options);
    });

    it('returns processed CSS as string when sourcemaps are disabled', function () {
      options.sourcemaps = false;
      var processed = pleeease.process('div { color: white }', options);

      (processed.map === undefined).should.be.true;
      (processed.css === undefined).should.be.true;
      processed.should.be.type('string');
    });

    it('returns object result.map and result.css when sourcemaps are enabled', function () {

      options.sourcemaps = { map: {inline: false} };
      var processed = pleeease.process('div { color: white }', options);

      (processed.map === undefined).should.be.false;
      (processed.css === undefined).should.be.false;
      processed.map.should.be.type('object');
      processed.css.should.be.type('string');
    });

  });