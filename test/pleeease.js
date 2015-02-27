'use strict';
var pleeease   = require('../lib/pleeease'),
    postcss    = require('postcss'),
    minifier   = require('csswring');

var helpers    = require('../test/_helpers.js');

/**
 *
 * Describe Pleeease
 *
 */
describe('Pleeease', function () {

  beforeEach(function() {
  });

  it('processes CSS as string', function () {
    var css = 'a{a:a}';
    pleeease.process(css).should.eql(css);
  });

  it('processes CSS as PostCSS AST', function () {
    var css = 'a{a:a}';
    var ast = postcss.parse(css);
    pleeease.process(ast).should.eql(css);
  });

  it('throws error when no arguments are given', function () {
    (function () {
      return pleeease.process();
    }).should.throw(/^CSS missing/);
  });

  it('throws error when PostCSS fails parsing CSS', function () {
    (function () {
      return pleeease.process(true);
    }).should.throwError;
    (function () {
      return pleeease.process({});
    }).should.throwError;
  });

  it('processes CSS string with options', function () {
    var css = 'a{}';
    pleeease.process(css, {minifier: false}).should.eql(css);
  });

  it('uses filename from `sourcemaps.from` option', function () {
    var file = 'in.css';
    var map = pleeease.process('a{a:a}', {sourcemaps: {map: {inline: false}, from: file}}).map;
    map.toJSON().sources[0].should.eql(file);
  });

  it('can be used as a plugin', function () {
    postcss().use(pleeease).process('a{a: a}').css.should.eql('a{a:a}');
  });

  it('accepts options when use as a plugin', function () {
    postcss().use(pleeease({minifier: false})).process('a{a: a}').css.should.eql('a{a: a}');
    postcss().use(pleeease({minifier: true})).process('a{a: a}').css.should.eql('a{a:a}');
  });

  it('can be piped with another module', function () {
    postcss().use(pleeease({minifier: false})).use(minifier).process('a{a: a}').css.should.eql('a{a:a}');
  });

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

  describe('Sourcemaps', function () {

    var opts = {};

    beforeEach(function() {
      opts.minifier = false;
    });

    it('creates default inline sourcemaps', function () {
      opts.sourcemaps = true;
      helpers.test('sourcemaps', opts);
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
      opts.sourcemaps = { map: {inline: false} };
      var processed = pleeease.process('a{a:a}', opts);
      (processed.map === undefined).should.be.false;
      (processed.css === undefined).should.be.false;
      processed.map.should.be.type('object');
      processed.css.should.be.type('string');
    });

  });

});