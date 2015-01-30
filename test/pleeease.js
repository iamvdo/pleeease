'use strict';
var pleeease   = require('../lib/pleeease'),
    Options    = require('../lib/options'),
    postcss    = require('postcss'),
    minifier   = require('csswring');

var helpers    = require('../test/_helpers.js');

/**
 *
 * Describe Pleeease
 *
 */
describe('Pleeease', function () {

  var options = {};

  beforeEach(function() {
    options = new Options().options;
    options.minifier = false;
  });

  it('processes CSS as string', function () {
    pleeease.process('a{a:a}').should.eql('a{a:a}');
  });

  it('processes CSS as PostCSS AST', function () {
    var ast = postcss.parse('a{a:a}');
    pleeease.process(ast).should.eql('a{a:a}');
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
    pleeease.process('a{}', {minifier: false}).should.eql('a{}');
  });

  it('uses filename from `sourcemaps.from` option', function () {
    var file = 'in.css';
    var map = pleeease.process('a{a:a}', {sourcemaps: {map: {inline: false}, from: file}}).map;
    map._file.should.eql(file);
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

  it('creates default inline sourcemaps', function () {
    options.sourcemaps = true;
    helpers.test('sourcemaps', options);
  });

  it('returns processed CSS as string when sourcemaps are disabled', function () {
    options.sourcemaps = false;
    var processed = pleeease.process('div { color: white }', options);

    (processed.map === undefined).should.be.true;
    (processed.css === undefined).should.be.true;
    processed.should.be.type('string');
  });

  it('returns object result.map and result.css when sourcemaps are enabled', function () {

    options.sourcemaps = { map: {inline: false} };
    var processed = pleeease.process('div { color: white }', options);

    (processed.map === undefined).should.be.false;
    (processed.css === undefined).should.be.false;
    processed.map.should.be.type('object');
    processed.css.should.be.type('string');

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
    options.autoprefixer = false;
    var result   = standalone.process(css, options);

    expected.should.be.eql(result);

  });

});