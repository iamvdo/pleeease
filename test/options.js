'use strict';

var fs = require('fs');

/**
 *
 * Describe Options
 *
 */
describe('Options', function () {

  var Options  = require('../lib/options');

  var opts;

  beforeEach(function() {
    opts = {};
  });

  it('creates options', function () {

    opts = Options();
    opts.should.have.property('options');
    opts.options.should.not.eql({});

  });

  it('creates options with default values', function () {

    opts = Options();
    opts = opts.options;
    opts.should.have.property('autoprefixer').eql({});

  });

  it('extends values', function () {

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

  it('extends values when set to true', function () {

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

  it('extends values when an object is set', function () {

    opts.minifier = {
      removeAllComments: true
    };
    opts = Options().extend(opts);
    opts.minifier.should.have.property('removeAllComments').eql(true);
    opts.minifier.should.have.property('preserveHacks').eql(true);

  });

  it('extends values when an object containing a default value is set', function () {

    opts.minifier = {
      preserveHacks: false,
      removeAllComments: true
    };
    opts = Options().extend(opts);
    opts.minifier.should.have.property('removeAllComments').eql(true);
    opts.minifier.should.have.property('preserveHacks').eql(false);

  });

  it('extends values for cssnext', function () {

    opts.cssnext = true;
    opts = Options().extend(opts);
    opts.cssnext.should.have.property('import').eql(false);
    opts.cssnext.features.should.have.property('autoprefixer').eql(false);


    opts.cssnext = {
      features: {
        customProperties: {
          preserve: true
        }
      }
    };
    opts = Options().extend(opts);
    opts.cssnext.features.customProperties.should.have.property('preserve').eql(true);
    opts.cssnext.features.should.have.property('autoprefixer').eql(false);
    opts.cssnext.should.have.property('import').eql(false);

    opts.cssnext = {
      features: {
        customProperties: false
      }
    };
    opts = Options().extend(opts);
    opts.cssnext.features.should.have.property('customProperties').eql(false);
    opts.cssnext.features.should.have.property('autoprefixer').eql(false);
    opts.cssnext.should.have.property('import').eql(false);

    opts.cssnext = {
      import: true
    };
    opts = Options().extend(opts);
    opts.cssnext.should.have.property('import').eql(true);

    opts.cssnext = {
      features: {
        autoprefixer: {
          browsers: ['ios 6']
        }
      }
    };
    opts = Options().extend(opts);
    opts.cssnext.features.autoprefixer.should.have.property('browsers').eql(['ios 6']);

  });

  it('extends options/values from configuration file', function () {

    var json = '{"autoprefixer": {"browsers": ["ie 8"]},"next": {"colors": true}}';
    var pleeeaseRC = fs.writeFileSync('test/.pleeeaserc', json);

    opts = Options();
    opts = opts.extendConfig(opts.defaults, 'test/.pleeeaserc');
    opts.autoprefixer.browsers.should.eql(["ie 8"]);
    opts.next.colors.should.eql(true);

    fs.unlinkSync('test/.pleeeaserc');

  });

  it('overrides values when `browsers` option is set', function () {

    opts.rem = ['20px'];
    opts.browsers = ['ie 9'];
    opts = Options().extend(opts);
    opts.autoprefixer.should.have.property('browsers').eql(['ie 9']);
    opts.rem.should.eql(false);
    opts.opacity.should.eql(false);
    opts.pseudoElements.should.eql(false);

  });

  it('has correct values when multiple browsers are set', function () {

    opts.browsers = ['last 99 versions'];
    opts = Options().extend(opts);
    opts.rem.should.eql(['16px']);
    opts.opacity.should.eql(true);
    opts.pseudoElements.should.eql(true);

  });

  it('overrides values when `browsers` option is set in `autoprefixer` too', function () {

    opts.autoprefixer = { browsers: ['ie 9'] };
    opts = Options().extend(opts);
    opts.rem.should.eql(false);

  });

  it('uses `browsers` option instead of `autoprefixer` one', function () {

    opts.autoprefixer = { browsers: ['ie 8'] };
    opts.browsers = ['ie 9'];
    opts = Options().extend(opts);
    opts.rem.should.eql(false);

  });

  it('converts `browsers` option to Array if it\'s not', function () {

    opts.browsers = 'ie 9';
    opts = Options().extend(opts);
    opts.autoprefixer.should.have.property('browsers').eql(['ie 9']);

  });

  it('errors when using multiple preprocessors', function () {

    opts.sass = true;
    opts.less = true;
    (function () {
      return Options().extend(opts);
    }).should.throwError();

  });

});