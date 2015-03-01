'use strict';

var pleeease  = require('../lib/pleeease');
var Options   = require('../lib/options');
var SourceMap = require('source-map');
var fs        = require('fs');

var helpers  = require('../test/_helpers.js');

/**
 *
 * Describe Sourcemaps
 *
 */
describe('Sourcemaps', function () {

  var opts;

  beforeEach(function () {
    opts = {};
  });

  describe('Options', function () {

    var input  = 'input.css';
    var output = 'output.css';

    it('creates default sourcemaps options', function () {
      opts.sourcemaps = true;
      opts = new Options().extend(opts);
      opts.sourcemaps.should.have.property('map').eql({inline: true});

      opts.sourcemaps = false;
      opts = new Options().extend(opts);
      opts.sourcemaps.should.eql(false);

      opts.sourcemaps = {};
      opts = new Options().extend(opts);
      opts.sourcemaps.should.have.property('map').eql({inline: true});

      opts.sourcemaps = {map: true};
      opts = new Options().extend(opts);
      opts.sourcemaps.should.have.property('map').eql({inline: true});

      opts.sourcemaps = {map: false};
      opts = new Options().extend(opts);
      opts.sourcemaps.should.eql(false);

      opts.sourcemaps = {map: {}};
      opts = new Options().extend(opts);
      opts.sourcemaps.should.have.property('map').eql({inline: true});

      opts.sourcemaps = {map: {inline: true}};
      opts = new Options().extend(opts);
      opts.sourcemaps.should.have.property('map').eql({inline: true});

      opts.sourcemaps = {map: {inline: false}};
      opts = new Options().extend(opts);
      opts.sourcemaps.should.have.property('map').eql({inline: false, annotation: true});
    });

    it('uses `from` and `to` from sourcemaps for filename', function () {
      opts.sourcemaps = {
        'from': input,
        'to'  : output
      };
      opts = new Options().extend(opts);
      opts.sourcemaps.should.have.property('map').eql({inline: true});
      opts.sourcemaps.should.have.property('from').eql(input);
      opts.sourcemaps.should.have.property('to').eql(output);
    });

    it('removes `in` and `out` and set `from` and `to`', function () {
      opts.in  = input;
      opts.out = output;
      opts.sourcemaps = true;
      opts = new Options().extend(opts);
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
      opts = new Options().extend(opts);
      (opts.in  === undefined).should.be.true;
      (opts.out === undefined).should.be.true;
      opts.sourcemaps.should.have.property('from').eql(input);
      opts.sourcemaps.should.have.property('to').eql(output);
    });

    it('keeps sourcemaps settings', function () {
      opts.out = output;
      opts.sourcemaps = {
        map: {inline: false},
        from: input
      };
      opts = new Options().extend(opts);
      opts.sourcemaps.should.have.property('from').eql(input);
      opts.sourcemaps.should.have.property('to').eql(output);
      opts.sourcemaps.map.should.have.property('inline').eql(false);
      (opts.out === undefined).should.be.true;
    });

    it('uses default filenames if `from`/`to` are not set', function () {
      var from = '<no-source>';
      var to   = '<no-output>';
      opts.sourcemaps = true;
      opts = new Options().extend(opts);
      opts.sourcemaps.should.have.property('from').eql(from);
      opts.sourcemaps.should.have.property('to').eql(to);
    });

    it('does not add specific config when sourcemaps is disabled', function () {
      opts.sass = true;
      opts.sourcemaps = false;
      opts = new Options().extend(opts);
      opts.sourcemaps.should.eql(false);
      opts.sass.should.eql({});
    });

    it('forces global sourcemaps', function () {
      function test (type, sourcemap) {
        var opts = {};
        opts[type] = sourcemap;
        opts = new Options().extend(opts);
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
      opts = new Options().extend(opts);
      opts.sass.sourceMap.should.eql(true);
      opts.sass.sourceMapEmbed.should.eql(false);

      opts = {
        less: true,
        sourcemaps: true
      };
      opts = new Options().extend(opts);
      opts.less.sourceMap.should.have.property('sourceMapFileInline').eql(false);

      opts = {
        stylus: true,
        sourcemaps: true
      };
      opts = new Options().extend(opts);
      opts.stylus.sourcemap.should.have.property('inline').eql(false);
    });

    it('overrides sourcemap inline options', function () {
      opts = {
        sass: {
          sourceMap: true,
          sourceMapEmbed: true
        },
        sourcemaps: true
      };
      opts = new Options().extend(opts);
      opts.sass.sourceMap.should.eql(true);
      opts.sass.sourceMapEmbed.should.eql(false);

      opts = {
        less: {
          sourceMap: {
            sourceMapFileInline: true
          }
        },
        sourcemaps: true
      };
      opts = new Options().extend(opts);
      opts.less.sourceMap.should.have.property('sourceMapFileInline').eql(false);

      opts = {
        stylus: {
          sourcemap: {
            inline: true
          }
        },
        sourcemaps: true
      };
      opts = new Options().extend(opts);
      opts.stylus.sourcemap.should.have.property('inline').eql(false);
    });

    it('allows override specific options', function () {
      opts = {
        sass: {
          dumb: 'dumb'
        },
        sourcemaps: true
      };
      opts = new Options().extend(opts);
      opts.sass.should.have.property('dumb').eql('dumb');

      opts = {
        less: {
          dumb: 'dumb',
          sourceMap: {
            sourceMapBasepath: 'dumb'
          }
        },
        sourcemaps: true
      };
      opts = new Options().extend(opts);
      opts.less.should.have.property('dumb').eql('dumb');
      opts.less.sourceMap.should.have.property('sourceMapBasepath').eql('dumb');

      opts = {
        stylus: {
          dumb: 'dumb',
          sourcemap: {
            basePath: 'dumb'
          }
        },
        sourcemaps: true
      };
      opts = new Options().extend(opts);
      opts.stylus.should.have.property('dumb').eql('dumb');
      opts.stylus.sourcemap.should.have.property('basePath').eql('dumb');
    });

  });

  describe('Pleeease', function () {

    beforeEach(function() {
    });

    it('returns processed CSS as string when sourcemaps are disabled', function () {
      opts.sourcemaps = false;
      var processed = pleeease.process('a{a:a}', opts);
      (processed.map === undefined).should.be.true;
      (processed.css === undefined).should.be.true;
      processed.should.be.type('string');
    });

    it('returns processed CSS as string when sourcemaps are enabled (not inlined)', function () {
      opts.sourcemaps = true;
      var processed = pleeease.process('a{a:a}', opts);
      (processed.map === undefined).should.be.true;
      (processed.css === undefined).should.be.true;
      processed.should.be.type('string');
    });

    it('returns result.map and result.css when sourcemaps are not inlined', function () {
      opts.sourcemaps = {map: {inline: false}};
      var processed = pleeease.process('a{a:a}', opts);
      (processed.map === undefined).should.be.false;
      (processed.css === undefined).should.be.false;
      processed.map.should.be.type('object');
      processed.css.should.be.type('string');
    });

    it('adds annotation when sourcemaps are not inlined', function () {
      opts.sourcemaps = {map: {inline: false}};
      var processed = pleeease.process('a{a:a}', opts);
      processed.css.should.containEql('sourceMappingURL=');
    });

    it('create sourcemaps', function () {
      var dirname = 'test/sourcemaps/css/';
      var input   = dirname + 'import.css';
      var output  = dirname + 'to.css';
      opts.sourcemaps = {map: {inline: false}, from: input, to: output};
      opts.import = {
        path: [dirname]
      };
      opts.minifier = false;
      var css = fs.readFileSync(input);
      var processed = pleeease.process(css, opts);

      var smc = new SourceMap.SourceMapConsumer(processed.map.toJSON());
      var positions = smc.originalPositionFor({line: 4, column: 0});
      positions.source.should.eql('import.css');
      positions.line.should.eql(2);
      positions.column.should.eql(0);

      positions = smc.originalPositionFor({line: 1, column: 0});
      positions.source.should.eql('imported.css');
      positions.line.should.eql(1);
      positions.column.should.eql(0);

      positions = smc.generatedPositionFor({source: 'import.css', line: 2, column: 0});
      positions.line.should.eql(4);
      positions.column.should.eql(0);

      positions = smc.generatedPositionFor({source: 'imported.css', line: 1, column: 0});
      positions.line.should.eql(1);
      positions.column.should.eql(0);

      // with minifier
      /*
      opts.minifier = true;
      processed = pleeease.process(css, opts);

      smc = new SourceMap.SourceMapConsumer(processed.map.toJSON());
      positions = smc.originalPositionFor({line: 1, column: 23});
      positions.source.should.eql('import.css');
      positions.line.should.eql(2);
      positions.column.should.eql(0);

      positions = smc.originalPositionFor({line: 1, column: 0});
      positions.source.should.eql('imported.css');
      positions.line.should.eql(1);
      positions.column.should.eql(0);

      positions = smc.generatedPositionFor({source: 'import.css', line: 2, column: 0});
      positions.line.should.eql(1);
      positions.column.should.eql(21);

      positions = smc.generatedPositionFor({source: 'imported.css', line: 1, column: 0});
      positions.line.should.eql(1);
      positions.column.should.eql(0);
      */
    });

    it('creates default inline sourcemaps', function () {
      opts.sourcemaps = true;
      opts.minifier = false;
      helpers.test('sourcemaps', opts);
    });

  });

  describe('Preprocessors', function () {

    var dirname = 'test/preprocessors/';

    it('adds annotations with preprocessors', function () {
      opts.sourcemaps = {map: {inline: false}};
      opts.sass = true;
      var processed = pleeease.process('a{a:a}', opts);
      processed.css.should.containEql('sourceMappingURL=');

      opts.sass = false;
      opts.less = true;
      var processed = pleeease.process('a{a:a}', opts);
      processed.css.should.containEql('sourceMappingURL=');

      opts.sass = opts.less = false;
      opts.stylus = true;
      var processed = pleeease.process('a{a:a}', opts);
      processed.css.should.containEql('sourceMappingURL=');
    });

    describe('generates good sourcemaps', function () {

      var css, expected, processed;
      var sourcemapLine   = 1;
      var sourcemapColumn = 541;

      beforeEach(function () {
        opts.browsers   = ['last 99 versions'];
        opts.sourcemaps = {map: {inline: false}};
        expected = fs.readFileSync(dirname + 'sourcemaps.out.css', 'utf-8');
      });

      afterEach(function () {
        var smc = new SourceMap.SourceMapConsumer(processed.map.toJSON());
        var positions = smc.originalPositionFor({line: sourcemapLine, column: sourcemapColumn});
        positions.line.should.eql(31);
      });

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

    describe('works in advanced structures', function () {

      var process = function (type, opts) {
        var input  = 'test/sourcemaps/src/files/main.' + type;
        var output = 'test/sourcemaps/pub/main.css';
        var css    = fs.readFileSync(input, 'utf-8');
        opts.in  = input;
        opts.out = output;
        var processed = pleeease.process(css, opts);
        // fs.writeFileSync('test/sourcemaps/pub/main.css', processed.css);
        // fs.writeFileSync('test/sourcemaps/pub/main.css.map', processed.map);
        return {type: type, map: processed.map.toJSON()};
      };
      var check = function (opts, specific) {
        opts.map.sources.should.be.instanceOf(Array).with.lengthOf(specific.nb);
        if (specific.nb === 4) {
          opts.map.sources.should.containEql('main.css');
        }
        opts.map.sources.should.containEql('../src/files/_import.' + opts.type);
        opts.map.sources.should.containEql('../src/files/main.' + opts.type);
        opts.map.sources.should.containEql('../src/modules/module.' + opts.type);
        var smc = new SourceMap.SourceMapConsumer(opts.map);
        var positions = smc.generatedPositionFor({source: '../src/modules/module.' + opts.type, line: 1, column: 0});
        positions.column.should.eql(19);
      };

      beforeEach(function () {
        opts = {
          sourcemaps: {
            map: {
              inline: false
            }
          }
        };
      });

      it('using Sass', function () {
        opts.sass = {
          includePaths: ['test/sourcemaps/src/files']
        };
        check(process('scss', opts), {nb: 3});
      });

      it('using LESS', function () {
        opts.less = {
          paths: ['test/sourcemaps/src/files']
        };
        check(process('less', opts), {nb: 4});
      });

      it('using Stylus', function () {
        opts.stylus = {
          paths: ['test/sourcemaps/src/files']
        };
        check(process('styl', opts), {nb: 4});
      });

    });

  });

});
