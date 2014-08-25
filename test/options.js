'use strict';

/**
 *
 * Describe Options
 *
 */
describe('Options', function () {

  var pleeease = require('../lib/');
  var Options  = require('../lib/options');
  var assert   = require('assert');

  var opts;

  beforeEach(function() {
    opts = {};
  });

  it('should extend default values for postprocessors', function () {

    opts.autoprefixer = {browsers: ["last 20 versions"]};
    opts = Options().extend(opts);
    opts.autoprefixer.browsers.should.eql(["last 20 versions"]);

  });

  it('should extend default values when set to true', function () {

    opts.autoprefixer = true;
    opts = Options().extend(opts);
    opts.autoprefixer.should.eql({});

    opts.minifier = true;
    opts = Options().extend(opts);
    opts.minifier.should.have.property('preserveHacks').eql(true);

  });

  it('should extend default values for pleeease.next', function () {

    opts.next = {};

    opts.next.customProperties = true;
    opts = Options().extend(opts);
    opts.next.customProperties.should.eql({});

    opts.next = true;
    opts = Options().extend(opts);

    opts.next.should.have.property('customProperties').eql({});

  });

});