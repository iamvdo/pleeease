'use strict';

var fs        = require('fs');
var pleeease  = require('../lib/pleeease');
var Options   = require('../lib/options');
var SourceMap = require('source-map');

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
      opts.sourcemaps.should.have.property('from');
      opts.sourcemaps.should.have.property('to');

      opts.sourcemaps = false;
      opts = new Options().extend(opts);
      opts.sourcemaps.should.eql(false);

      opts.sourcemaps = {};
      opts = new Options().extend(opts);
      opts.sourcemaps.should.not.have.property('map');
      opts.sourcemaps.should.have.property('from');
      opts.sourcemaps.should.have.property('to');

      opts.sourcemaps = {map: true};
      opts = new Options().extend(opts);
      opts.sourcemaps.should.have.property('map').eql({inline: true});
      opts.sourcemaps.should.have.property('from');
      opts.sourcemaps.should.have.property('to');

      opts.sourcemaps = {map: false};
      opts = new Options().extend(opts);
      opts.sourcemaps.should.not.have.property('map');
      opts.sourcemaps.should.have.property('from');
      opts.sourcemaps.should.have.property('to');

      opts.sourcemaps = {map: {}};
      opts = new Options().extend(opts);
      opts.sourcemaps.should.have.property('map').eql({inline: true});
      opts.sourcemaps.should.have.property('from');
      opts.sourcemaps.should.have.property('to');

      opts.sourcemaps = {map: {inline: true}};
      opts = new Options().extend(opts);
      opts.sourcemaps.should.have.property('map').eql({inline: true});
      opts.sourcemaps.should.have.property('from');
      opts.sourcemaps.should.have.property('to');

      opts.sourcemaps = {map: {inline: false}};
      opts = new Options().extend(opts);
      opts.sourcemaps.should.have.property('map').eql({inline: false, annotation: true});
      opts.sourcemaps.should.have.property('from');
      opts.sourcemaps.should.have.property('to');

      opts.sourcemaps = {map: {inline: false, annotation: false}};
      opts = new Options().extend(opts);
      opts.sourcemaps.should.have.property('map').eql({inline: false, annotation: false});
      opts.sourcemaps.should.have.property('from');
      opts.sourcemaps.should.have.property('to');
    });

    it('uses `from` and `to` from sourcemaps for filename', function () {
      opts.sourcemaps = {
        'from': input,
        'to'  : output
      };
      opts = new Options().extend(opts);
      opts.sourcemaps.should.not.have.property('map');
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
      opts.sourcemaps.should.not.have.property('map');
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

    it('returns processed CSS as string when sourcemaps are disabled', function (done) {
      opts.sourcemaps = false;
      pleeease.process('a{a:a}', opts).then(function (result) {
        (result.map === undefined).should.be.true;
        (result.css === undefined).should.be.true;
        result.should.be.type('string');
        done();
      }).catch(done);
    });

    it('returns processed CSS as string when sourcemaps are disabled, even if `to` of `from` are set', function (done) {
      opts.sourcemaps = {from: 'input.css', to: 'output.css'};
      pleeease.process('a{a:a}', opts).then(function (result) {
        (result.map === undefined).should.be.true;
        (result.css === undefined).should.be.true;
        done();
      }).catch(done);
    });

    it('returns processed CSS as string when sourcemaps are enabled (not inlined)', function (done) {
      opts.sourcemaps = true;
      pleeease.process('a{a:a}', opts).then(function (result) {
        (result.map === undefined).should.be.true;
        (result.css === undefined).should.be.true;
        result.should.be.type('string');
        done();
      }).catch(done);
    });

    it('returns result.map and result.css when sourcemaps are not inlined', function (done) {
      opts.sourcemaps = {map: {inline: false}};
      pleeease.process('a{a:a}', opts).then(function (result) {
        (result.map === undefined).should.be.false;
        (result.css === undefined).should.be.false;
        result.map.should.be.type('object');
        result.css.should.be.type('string');
        done();
      }).catch(done);
    });

    it('adds annotation when sourcemaps are not inlined', function (done) {
      opts.sourcemaps = {map: {inline: false}};
      pleeease.process('a{a:a}', opts).then(function (result) {
        result.css.should.containEql('sourceMappingURL=');
        done();
      }).catch(done);
    });

    it('create sourcemaps', function (done) {
      var dirname = 'test/sourcemaps/css/';
      var input   = dirname + 'import.css';
      var output  = dirname + 'to.css';
      opts.sourcemaps = {map: {inline: false}, from: input, to: output};
      opts.import = {
        path: [dirname]
      };
      // without minifier
      opts.minifier = false;
      var css = fs.readFileSync(input);
      pleeease.process(css, opts).then(function (result) {
        var smc = new SourceMap.SourceMapConsumer(result.map.toJSON());
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

        done();
      }).catch(done);

    });

    it('create sourcemaps with minifier', function (done) {
      var dirname = 'test/sourcemaps/css/';
      var input   = dirname + 'import.css';
      var output  = dirname + 'to.css';
      opts.sourcemaps = {map: {inline: false}, from: input, to: output};
      opts.import = {
        path: [dirname]
      };
      // without minifier
      opts.minifier = true;
      var css = fs.readFileSync(input);
      pleeease.process(css, opts).then(function (result) {
        var smc = new SourceMap.SourceMapConsumer(result.map.toJSON());
        var positions = smc.originalPositionFor({line: 1, column: 21});
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

        done();
      }).catch(done);

    });

  });

  describe('Preprocessors', function () {

    var dirname = 'test/preprocessors/';

    describe('adds annotation', function () {

      beforeEach(function () {
        opts.sourcemaps = {map: {inline: false}};
      });

      it('with Sass', function (done) {
        opts.sass = true;
        pleeease.process('a{a:a}', opts).then(function (result) {
          result.css.should.containEql('sourceMappingURL=');
          done();
        }).catch(done);
      });
      it('with LESS', function (done) {
        opts.less = true;
        pleeease.process('a{a:a}', opts).then(function (result) {
          result.css.should.containEql('sourceMappingURL=');
          done();
        }).catch(done);
      });
      it('with Stylus', function (done) {
        opts.stylus = true;
        pleeease.process('a{a:a}', opts).then(function (result) {
          result.css.should.containEql('sourceMappingURL=');
          done();
        }).catch(done);
      });

    });

    describe('adds annotation only once', function () {

      beforeEach(function () {
        opts.sourcemaps = {map: {inline: false}};
      });

      it('with Sass', function (done) {
        opts.sass = true;
        pleeease.process('a{a:a}', opts).then(function (result) {
          result.css.match(/sourceMappingURL=/g).length.should.eql(1);
          done();
        }).catch(done);
      });
      it('with LESS', function (done) {
        opts.less = true;
        pleeease.process('a{a:a}', opts).then(function (result) {
          result.css.match(/sourceMappingURL=/g).length.should.eql(1);
          done();
        }).catch(done);
      });
      it('with Stylus', function (done) {
        opts.stylus = true;
        pleeease.process('a{a:a}', opts).then(function (result) {
          result.css.match(/sourceMappingURL=/g).length.should.eql(1);
          done();
        }).catch(done);
      });

    });

    describe('generates good sourcemaps', function () {

      var css, expected;
      var sourcemapLine   = 1;
      var sourcemapColumn = 541;

      beforeEach(function () {
        opts.browsers   = ['last 99 versions'];
        opts.sourcemaps = {map: {inline: false}};
        expected = fs.readFileSync(dirname + 'sourcemaps.out.css', 'utf-8');
      });

      function verif (result, done) {
        var smc = new SourceMap.SourceMapConsumer(result.map.toJSON());
        var positions = smc.originalPositionFor({line: sourcemapLine, column: sourcemapColumn});
        positions.line.should.eql(31);
        done();
      }

      it('using Sass', function (done) {
        css       = fs.readFileSync(dirname + 'sass/sourcemaps.scss', 'utf-8');
        opts.sass = true;
        pleeease.process(css, opts).then(function (result) {
          verif(result, done);
        }).catch(done);
      });
      it('using LESS', function (done) {
        css       = fs.readFileSync(dirname + 'less/sourcemaps.less', 'utf-8');
        opts.less = true;
        pleeease.process(css, opts).then(function (result) {
          verif(result, done);
        }).catch(done);
      });
      it('using Stylus', function (done) {
        css      = fs.readFileSync(dirname + 'stylus/sourcemaps.styl', 'utf-8');
        opts.stylus = true;
        opts.sourcemaps.from = dirname + 'stylus/sourcemaps.styl';
        pleeease.process(css, opts).then(function (result) {
          verif(result, done);
        }).catch(done);
      });

    });

    describe('works in advanced structures', function () {

      var process = function (type, opts, specific, done) {
        var input  = 'test/sourcemaps/src/files/main.' + type;
        var output = 'test/sourcemaps/pub/main.css';
        var css    = fs.readFileSync(input, 'utf-8');
        opts.in  = input;
        opts.out = output;
        pleeease.process(css, opts).then(function (result) {
          check({type: type, map: result.map.toJSON()}, specific, done);
        }).catch(done);
      };
      var check = function (opts, specific, done) {
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
        done();
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

      it('using Sass', function (done) {
        opts.sass = {
          includePaths: ['test/sourcemaps/src/files']
        };
        process('scss', opts, {nb: 3}, done);
      });

      it('using LESS', function (done) {
        opts.less = {
          paths: ['test/sourcemaps/src/files']
        };
        process('less', opts, {nb: 4}, done);
      });

      it('using Stylus', function (done) {
        opts.stylus = {
          paths: ['test/sourcemaps/src/files']
        };
        process('styl', opts, {nb: 4}, done);
      });

    });

  });

});
