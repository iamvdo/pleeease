'use strict';

var fs = require('fs');

/**
 *
 * Describe Options
 *
 */
describe('Options', function () {

  var Options  = require('../lib/options');
  var assert   = require('assert');

  var opts;

  beforeEach(function() {
    opts = {};
  });

  it('should create options', function () {

    opts = Options();
    opts.should.have.property('options');
    opts.options.should.not.eql({});

  });

  it('should create options with default values', function () {

    opts = Options();
    opts = opts.options;
    opts.should.have.property('autoprefixer').eql({});

  });

  it('should extend values', function () {

    opts.autoprefixer = {
      browsers: ["last 20 versions"]
    };
    opts = Options().extend(opts);
    opts.autoprefixer.browsers.should.eql(["last 20 versions"]);

    opts = {
      rem: ['10px', {replace: true}]
    };
    opts = Options().extend(opts);
    opts.rem.should.eql(['10px', {replace: true}]);

  });

  it('should extend values when set to true', function () {

    opts.autoprefixer = true;
    opts = Options().extend(opts);
    opts.autoprefixer.should.eql({});

    opts.minifier = true;
    opts = Options().extend(opts);
    opts.minifier.should.have.property('preserveHacks').eql(true);

    opts.mqpacker = true;
    opts = Options().extend(opts);
    opts.mqpacker.should.eql(true);

  });

  it('should extend values when an object is set', function () {

    opts.minifier = {
      removeAllComments: true
    };
    opts = Options().extend(opts);
    opts.minifier.should.have.property('removeAllComments').eql(true);
    opts.minifier.should.have.property('preserveHacks').eql(true);

    opts.minifier = {
      preserveHacks: false,
      removeAllComments: true
    };
    opts = Options().extend(opts);
    opts.minifier.should.have.property('removeAllComments').eql(true);
    opts.minifier.should.have.property('preserveHacks').eql(false);

  });

  it('should extend values for pleeease.next', function () {

    opts.next = true;
    opts = Options().extend(opts);
    opts.next.should.have.property('customProperties').eql({});
    opts.next.should.have.property('calc').eql(true);

    opts.next = {
      customProperties: true
    };
    opts = Options().extend(opts);
    opts.next.customProperties.should.eql({});
    opts.next.should.not.have.property('calc');

    opts.next = {
      customProperties: false,
      colors: true
    };
    opts = Options().extend(opts);
    opts.next.should.have.property('customProperties').eql(false);
    opts.next.should.have.property('colors').eql({});

  });

  it('should extend LESS options', function () {

    opts.less = {
      path: ['path']
    };
    opts = Options().extend(opts);
    opts.less.should.have.property('syncImport').eql(true);

  });

  it('should extend options/values from configuration file', function () {

    var json = '{"autoprefixer": {"browsers": ["ie 8"]},"next": {"colors": true}}';
    var pleeeaseRC = fs.writeFileSync('test/.pleeeaserc', json);

    opts = Options();
    opts = opts.extendConfig(opts.defaults, 'test/.pleeeaserc');
    opts.autoprefixer.browsers.should.eql(["ie 8"]);
    opts.next.colors.should.eql(true);

    fs.unlinkSync('test/.pleeeaserc');

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

    opts.autoprefixer = { browsers: ['ie 9'] };
    opts = Options().extend(opts);
    opts.rem.should.eql(false);

  });

  it('should use `browsers` option instead of `autoprefixer` one', function () {

    opts.autoprefixer = { browsers: ['ie 8'] };
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