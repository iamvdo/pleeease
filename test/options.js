'use strict';

var Options  = require('../lib/options');
var fs       = require('fs');

/**
 *
 * Describe Options
 *
 */
describe('Options', function () {

  var opts;

  beforeEach(function () {
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

  it('extends values for pleeease.next', function () {
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

  describe('Sourcemaps', function () {

    var input  = 'input.css';
    var output = 'output.css';

    it('creates default sourcemaps', function () {
      opts.sourcemaps = true;
      opts = Options().extend(opts);
      opts.sourcemaps.should.have.property('map').eql(true);
    });

    it('uses `from` and `to` from sourcemaps for filename', function () {
      opts.sourcemaps = {
        'from': input,
        'to'  : output
      };
      opts = Options().extend(opts);
      opts.sourcemaps.should.have.property('map').eql(true);
      opts.sourcemaps.should.have.property('from').eql(input);
      opts.sourcemaps.should.have.property('to').eql(output);
    });

    it('removes `in` and `out` and set `from` and `to`', function () {
      opts.in  = input;
      opts.out = output;
      opts.sourcemaps = true;
      opts = Options().extend(opts);
      (opts.in  === undefined).should.be.true;
      (opts.out === undefined).should.be.true;
      opts.sourcemaps.should.have.property('from').eql(input);
      opts.sourcemaps.should.have.property('to').eql(output);
    });

    it('uses `from` and `to` if both `in`/`out` and `from`/`to` are set', function () {
      opts.in  = input;
      opts.out = output;
      opts.sourcemaps = {
        'from': input,
        'to'  : output
      };
      opts = Options().extend(opts);
      (opts.in  === undefined).should.be.true;
      (opts.out === undefined).should.be.true;
      opts.sourcemaps.should.have.property('from').eql(input);
      opts.sourcemaps.should.have.property('to').eql(output);
    });

    it('keeps sourcemaps settings', function () {
      opts.out = output;
      opts.sourcemaps = {
        map: { inline: false },
        from: input
      };
      opts = Options().extend(opts);
      opts.sourcemaps.should.have.property('from').eql(input);
      opts.sourcemaps.should.have.property('to').eql(output);
      opts.sourcemaps.map.should.have.property('inline').eql(false);
      (opts.out === undefined).should.be.true;
    });

    it('uses default filenames if `from`/`to` are not set', function () {
      var from = '<no-source>';
      var to   = '<no-output>';
      opts.sourcemaps = true;
      opts = Options().extend(opts);
      opts.sourcemaps.should.have.property('from').eql(from);
      opts.sourcemaps.should.have.property('to').eql(to);
    });

    it('does not add specific config when sourcemaps is disabled', function () {
      opts.sass = true;
      opts.sourcemaps = false;
      opts = Options().extend(opts);
      opts.sourcemaps.should.eql(false);
      opts.sass.should.eql({});
    });

    it('forces global sourcemaps', function () {
      function test (type, sourcemap) {
        var opts = {};
        opts[type] = sourcemap;
        opts = Options().extend(opts);
        opts.sourcemaps.should.not.eql(false);
      }
      // Sass
      test('sass',   {sourceMap: true});
      test('less',   {sourceMap: true});
      test('stylus', {sourcemap: true});
    });

    it('creates specific options when global sourcemaps option is true', function () {
      opts = {
        sass: true,
        sourcemaps: true
      };
      opts = Options().extend(opts);
      opts.sass.sourceMap.should.eql(true);
      opts.sass.sourceMapEmbed.should.eql(true);

      opts = {
        less: true,
        sourcemaps: true
      };
      opts = Options().extend(opts);
      opts.less.sourceMap.should.have.property('sourceMapFileInline').eql(true);

      opts = {
        stylus: true,
        sourcemaps: true
      };
      opts = Options().extend(opts);
      opts.stylus.sourcemap.should.have.property('inline').eql(true);
    });

    it('overrides specific options', function () {
      opts = {
        sass: {
          sourceMap: true,
          sourceMapEmbed: false
        },
        sourcemaps: true
      };
      opts = new Options().extend(opts);
      opts.sass.sourceMap.should.eql(true);
      opts.sass.sourceMap.should.eql(true);

      opts = {
        less: {
          sourceMap: {
            sourceMapFileInline: false,
            sourceTest: 'test'
          }
        },
        sourcemaps: true
      };
      opts = new Options().extend(opts);
      opts.less.sourceMap.should.have.property('sourceMapFileInline').eql(true);
      opts.less.sourceMap.should.not.have.property('sourceTest');

      opts = {
        stylus: {
          sourcemap: {
            inline: false,
            sourceTest: 'test'
          }
        },
        sourcemaps: true
      };
      opts = new Options().extend(opts);
      opts.stylus.sourcemap.should.have.property('inline').eql(true);
      opts.stylus.sourcemap.should.not.have.property('sourceTest');
    });

  });

});