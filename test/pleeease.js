'use strict';
var pleeease   = require('../lib/pleeease');
var postcss    = require('postcss');
var minifier   = require('csswring');

/**
 *
 * Describe Pleeease
 *
 */
describe('Pleeease', function () {

  beforeEach(function() {
  });

  it('returns promise', function () {
    var css = 'a{a:a}';
    var result = pleeease.process(css);
    result.should.be.a.Promise();
  });

  it('processes CSS as string', function (done) {
    var css = 'a{a:a}';
    pleeease.process(css).then(function (result) {
      result.should.eql(css);
      done();
    }).catch(done);
  });

  it('processes CSS as PostCSS AST', function (done) {
    var css = 'a{a:a}';
    var ast = postcss.parse(css);
    pleeease.process(ast).then(function (result) {
      result.should.eql(css);
      done();
    }).catch(done);
  });

  it('throws error when no arguments are given', function (done) {
    pleeease.process().then(function () {
      done('should not run');
    }).catch(function (error) {
      error.should.be.an.instanceOf(Error);
      error.should.have.property('message', 'CSS missing in pleeease.process()');
      done();
    }).catch(done);
  });

  it('throws error with no catch', function (done) {
    pleeease.process().then(function () {
      done('should not run');
    }, function (error) {
      error.should.be.an.instanceOf(Error);
      error.should.have.property('message', 'CSS missing in pleeease.process()');
      done();
    }).catch(done);
  });

  it('throws CssSyntaxError error from PostCSS', function (done) {
    pleeease.process('a{').then(function () {
      done('should not run');
    }).catch(function (error) {
      error.should.be.an.instanceOf(Error);
      error.should.have.property('name', 'CssSyntaxError');
      error.should.have.property('reason', 'Unclosed block');
      done();
    }).catch(done);
  });

  it('throws CssSyntaxError error with no catch', function (done) {
    pleeease.process('a{').then(function () {
      done('should not run');
    }, function (error) {
      error.should.be.an.instanceOf(Error);
      error.should.have.property('name', 'CssSyntaxError');
      error.should.have.property('reason', 'Unclosed block');
      done();
    }).catch(done);
  });

  it('processes CSS string with options', function (done) {
    var css = 'a{}';
    pleeease.process(css, {minifier: false}).then(function (result) {
      result.should.eql(css);
      done();
    }).catch(done);
  });

  it('uses filename from `sourcemaps.from` option', function (done) {
    var file = 'in.css';
    var opts = {sourcemaps: {map: {inline: false}, from: file}};
    pleeease.process('a{a:a}', opts).then(function (result) {
      result.map.toJSON().sources[0].should.eql(file);
      done();
    }).catch(done);
  });

  it('can be used as a plugin', function (done) {
    postcss([pleeease]).process('a{a: a}').then(function (result) {
      result.css.should.eql('a{a:a}');
      done();
    }).catch(done);
  });

  it('throws when used as a plugin', function (done) {
    postcss([pleeease]).process('a{').then(function () {
      done('should not run');
    }).catch(function (error) {
      error.should.be.an.instanceOf(Error);
      error.should.have.property('name', 'CssSyntaxError');
      error.should.have.property('reason', 'Unclosed block');
      done();
    }).catch(done);
  });

  it('accepts options when use as a plugin', function (done) {
    postcss([pleeease({vmin: false})]).process('a{a: 1vmin}').then(function (result) {
      result.css.should.eql('a{a:1vmin}');
      done();
    }).catch(done);
  });

  it('can be piped with another module', function (done) {
    postcss([pleeease({minifier: false}), minifier]).process('a{a: 1vmin}').then(function (result) {
      result.css.should.eql('a{a:1vm;a:1vmin}');
      done();
    }).catch(done);
  });

  /*
  it('works in standalone version', function () {

    var json = require('../package.json');
    var version;
    for (var key in json) {
      if ('version' === key) {
        version = json[key];
        break;
      }
    }
    var standalone = require('../standalone/pleeease-' + version + '.min.js');
    var css      = helpers.readFile('test/features/filters.css');
    var expected = helpers.readFile('test/features/filters.out.css');
    var opts = {
      autoprefixer: false,
      minifier    : false
    };
    var processed   = standalone.process(css, opts);

    processed.should.be.eql(expected);

  });
  */

  describe('#parse', function () {

    var Root = require('../node_modules/postcss/lib/root.js');
    var internal, parsed;

    beforeEach(function () {
      internal = new pleeease.processor();
    });

    afterEach(function () {
      parsed.should.be.an.instanceOf(Root);
    });

    it('parses CSS as string', function () {
      parsed = internal.parse('a{a:a}');
    });

    it('parses CSS as PostCSS AST', function () {
      var css = 'a{a:a}';
      var ast = postcss.parse(css);
      parsed = internal.parse(ast);
    });

    it('parses with sourcemaps', function () {
      internal.setOptions({sourcemaps: true});
      parsed = internal.parse('a{a:a}');
    });

    it('parses with preprocessors', function () {
      internal.setOptions({sass: true});
      parsed = internal.parse('a{a:a}');
    });

    it('parses with preprocessors and sourcemaps', function () {
      internal.setOptions({sass: true, sourcemaps: true});
      parsed = internal.parse('a{a:a}');
    });

    it('parses with preprocessors and from/to files', function () {
      internal.setOptions({sass: true, in: 'input.css', out: 'output.css'});
      parsed = internal.parse('a{a:a}');
    });

  });

  describe('#setOptions', function () {

    it('extends default options', function () {
      var internal = new pleeease.processor();
      internal.setOptions({sourcemaps: true});
      internal.options.sourcemaps.should.be.an.instanceOf(Object);
      internal.options.sourcemaps.should.have.property('map');
    });

    it('extends only new options', function () {
      var internal = new pleeease.processor({rem: {rootValue: '20px'}});
      internal.options.rem.should.eql({rootValue: '20px'});
      internal.setOptions({autoprefixer: false});
      internal.options.rem.should.eql({rootValue: '20px'});
      internal.options.autoprefixer.should.eql(false);
    });

  });

});
