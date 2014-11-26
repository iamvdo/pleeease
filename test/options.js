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

  it('should override values when `browsers` option is set', function () {

    opts.rem = ['20px'];
    opts.browsers = ['ie 9'];
    opts = Options().extend(opts);

    opts.autoprefixer.should.have.property('browsers').eql(['ie 9']);
    opts.rem.should.eql(false);
    opts.opacity.should.eql(false);
    opts.pseudoElements.should.eql(false);

  });

  it('should override values when `browsers` option is set in `autoprefixer` too', function () {

    opts.autoprefixer = {browsers: ['ie 9']};
    opts = Options().extend(opts);
    opts.rem.should.eql(false);

  });

  it('should use `browsers` option instead of `autoprefixer` one', function () {

    opts.autoprefixer = {browsers: ['ie 8']};
    opts.browsers = ['ie 9'];
    opts = Options().extend(opts);
    opts.rem.should.eql(false);

  });

  it('should convert `browsers` option to Array if it\'s not', function () {

    opts.browsers = 'ie 9';
    opts = Options().extend(opts);

    opts.autoprefixer.should.have.property('browsers').eql(['ie 9']);

  });

});