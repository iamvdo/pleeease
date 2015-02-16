'use strict';

var Preprocessor = require('../lib/preprocessor');
var Options      = require('../lib/options');
var pleeease     = require('../lib/pleeease');
var fs           = require('fs');

var dirname = 'test/preprocessors/';

/**
 *
 * Describe Features
 *
 */
describe('Preprocessors', function () {

  var opts;

  beforeEach(function () {
    opts = {};
    opts.minifier = true;
  });

  describe('Processes plain ol\' CSS', function () {

    var css, expected, processed;

    beforeEach(function () {
      css      = fs.readFileSync(dirname + 'css.css', 'utf-8');
      expected = fs.readFileSync(dirname + 'css.out.css', 'utf-8');
      opts.import = {path: dirname};
    });

    afterEach(function () {
      processed = pleeease.process(css, opts);
      processed.should.eql(expected);
    });
    
    it('using Sass', function () {
      opts.sass = true;
    });
    it('using LESS', function () {
      opts.less = true;
    });
    it('using Stylus', function () {
      opts.stylus = true;
    });

  });

  describe('Compiles', function () {

    var css, expected, processed;

    beforeEach(function () {
      expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');
    });

    afterEach(function () {
      processed.should.eql(expected);
    });

    it('using Sass', function () {
      opts.sass = true;
      css       = fs.readFileSync(dirname + 'sass/preproc.scss', 'utf-8');
      processed = pleeease.process(css, opts);
    });
    it('using LESS', function () {
      opts.less = true;
      css       = fs.readFileSync(dirname + 'less/preproc.less', 'utf-8');
      processed = pleeease.process(css, opts);
    });
    it('using Stylus', function () {
      opts.stylus = true;
      css         = fs.readFileSync(dirname + 'stylus/preproc.styl', 'utf-8');
      processed   = pleeease.process(css, opts);
    });

  });

  describe('Imports', function () {

    var css, expected, processed;

    beforeEach(function () {
      expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');
    });

    afterEach(function () {
      processed.should.eql(expected);
    });

    it('files using Sass', function () {
      css       = fs.readFileSync(dirname + 'sass/import.scss', 'utf-8');
      opts.sass = {
        includePaths: ['test/preprocessors/sass']
      };
      processed = pleeease.process(css, opts);
    });
    it('files using LESS', function () {
      css       = fs.readFileSync(dirname + 'less/import.less', 'utf-8');
      opts.less = {
        paths: ['test/preprocessors/less']
      };
      processed = pleeease.process(css, opts);
    });
    it('files using Stylus', function () {
      css         = fs.readFileSync(dirname + 'stylus/import.styl', 'utf-8');
      opts.stylus = {
        paths: ['test/preprocessors/stylus']
      };
      processed = pleeease.process(css, opts);
    });

  });

  describe('Sourcemaps', function () {

    describe('creates specific options when global sourcemaps option is true', function () {

      beforeEach(function () {
        opts.sourcemaps = true;
      });

      it('using Sass', function () {
        opts.sass = true;
        opts = new Options().extend(opts);
        var pre = new Preprocessor('a{}', '<no-source>', opts);
        opts.sass = pre.setSourcemapsOptions('sass', opts);
        opts.sass.sourceMap.should.eql(true);
        opts.sass.sourceMapEmbed.should.eql(true);
      });
      it('using LESS', function () {
        opts.less = true;
        opts = new Options().extend(opts);
        var pre = new Preprocessor('a{}', '<no-source>', opts);
        opts.less = pre.setSourcemapsOptions('less', opts);
        opts.less.sourceMap.should.have.property('sourceMapFileInline').eql(true);
      });
      it('using Stylus', function () {
        opts.stylus = true;
        opts = new Options().extend(opts);
        var pre = new Preprocessor('a{}', '<no-source>', opts);
        opts.stylus = pre.setSourcemapsOptions('stylus', opts);
        opts.stylus.sourcemap.should.have.property('inline').eql(true);
      });

    });

    describe('creates specific options, no matter custom configuration', function () {

      it('using Sass', function () {
        opts = {
          sass: {
            sourceMap: true,
            sourceMapEmbed: false
          },
          sourcemaps: true
        };
        opts = new Options().extend(opts);
        var pre = new Preprocessor('a{}', '<no-source>', opts);
        opts.sass = pre.setSourcemapsOptions('sass', opts);
        opts.sass.sourceMap.should.eql(true);
        opts.sass.sourceMap.should.eql(true);
      });
      it('using LESS', function () {
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
        var pre = new Preprocessor('a{}', '<no-source>', opts);
        opts.less = pre.setSourcemapsOptions('less', opts);
        opts.less.sourceMap.should.have.property('sourceMapFileInline').eql(true);
        opts.less.sourceMap.should.not.have.property('sourceTest');
      });
      it('using Stylus', function () {
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
        var pre = new Preprocessor('a{}', '<no-source>', opts);
        opts.stylus = pre.setSourcemapsOptions('stylus', opts);
        opts.stylus.sourcemap.should.have.property('inline').eql(true);
        opts.stylus.sourcemap.should.not.have.property('sourceTest');
      });

    });

    describe('forces global sourcemaps', function () {

      var pre;

      afterEach(function () {
        pre.options.sourcemaps.should.eql(true);
      });

      it('using Sass', function () {
        opts = {
          sass: {
            sourceMap: true
          }
        };
        opts = new Options().extend(opts);
        pre  = new Preprocessor('a{}', '<no-source>', opts);
        opts = pre.setSourcemapsOptions('sass', opts);
      });
      it('using LESS', function () {
        opts = {
          less: {
            sourceMap: true
          }
        };
        opts = new Options().extend(opts);
        pre  = new Preprocessor('a{}', '<no-source>', opts);
        opts = pre.setSourcemapsOptions('less', opts);
      });
      it('using Stylus', function () {
        opts = {
          stylus: {
            sourcemap: true
          }
        };
        opts = new Options().extend(opts);
        pre  = new Preprocessor('a{}', '<no-source>', opts);
        opts = pre.setSourcemapsOptions('stylus', opts);
      });

    });

    describe('generates good sourcemaps', function () {

      var css, expected, processed;
      var sourcemapLine   = 1;
      var sourcemapColumn = 541;

      beforeEach(function () {
        opts.browsers   = ["last 99 versions"];
        opts.sourcemaps = {map: {inline: false}};
        expected = fs.readFileSync(dirname + 'sourcemaps.out.css', 'utf-8');
      });

      afterEach(function () {
        var Map = require('source-map');
        var smc = new Map.SourceMapConsumer(processed.map.toJSON());
        var positions = smc.originalPositionFor({line: sourcemapLine, column: sourcemapColumn});
        positions.line.should.eql(31);
      })

      it('using Sass', function () {
        css       = fs.readFileSync(dirname + 'sass/sourcemaps.scss', 'utf-8');
        opts.sass = true;
        processed = pleeease.process(css, opts);
      });
      it('using LESS', function () {
        css       = fs.readFileSync(dirname + 'less/sourcemaps.less', 'utf-8');
        opts.less = true;
        processed = pleeease.process(css, opts);
      });
      it('using Stylus', function () {
        css      = fs.readFileSync(dirname + 'stylus/sourcemaps.styl', 'utf-8');
        opts.stylus = true;
        opts.sourcemaps.from = dirname + 'stylus/sourcemaps.styl';
        processed = pleeease.process(css, opts);
      });

    });

  });

});