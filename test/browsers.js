'use strict';

/**
 *
 * Describe Browsers
 *
 */
describe('Browsers', function () {

  var Browsers = require('../lib/browsers');

  var browser;

  beforeEach(function () {
  });

  it('uses browserslist', function () {
    browser = new Browsers({browsers: ['ie < 9']});
    browser.selected.should.be.instanceOf(Array);
    browser.selected[0].should.be.eql('ie 8');
  });

  it('uses default browsers when no options are set', function () {
    browser = new Browsers();
    browser.selected.should.be.instanceOf(Array);
  });

  it('creates features', function () {
    browser = new Browsers();
    browser.features.should.instanceOf(Object);
    browser.features.should.have.property('rem');
    browser.features.should.have.property('opacity');
    browser.features.should.have.property('pseudoElements');
  });

});
