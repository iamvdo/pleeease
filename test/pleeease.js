'use strict';
var pleeease   = require('../lib/pleeease');
var postcss    = require('postcss');
var minifier   = require('csswring');

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

});
