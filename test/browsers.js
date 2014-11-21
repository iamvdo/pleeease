'use strict';

/**
 *
 * Describe Browsers
 *
 */
describe('Browsers', function () {

  var Browsers  = require('../lib/browsers');
  var assert   = require('assert');

  var browser;

  beforeEach(function() {
  });

  it('should create features', function () {

    browser = new Browsers({browsers: ['ie 8']});
    browser.features.should.have.property('rem');

  });

});