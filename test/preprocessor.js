'use strict';

var pleeease     = require('../lib/pleeease');
var fs           = require('fs');
var Preprocessor = require('../lib/preprocessor');

var dirname = 'test/preprocessors/';

/**
 *
 * Describe Features
 *
 */
describe('Preprocessor', function () {

  var opts;

  beforeEach(function () {
    opts = {};
    opts.minifier = true;
  });

  describe('#sass', function () {

    it('doesn\'t add annotation', function () {
      var p = new pleeease({sass: true, sourcemaps: true});
      var pre = new Preprocessor('a{a:a}', p.options);
      var result = pre.sass();
      result.css.should.not.containEql('sourceMappingURL=');
    });

  });

  describe('#less', function () {

    it('doesn\'t add annotation', function () {
      var p = new pleeease({less: true, sourcemaps: true});
      var pre = new Preprocessor('a{a:a}', p.options);
      var result = pre.less();
      result.css.should.not.containEql('sourceMappingURL=');
    });

  });

  describe('#stylus', function () {

    it('doesn\'t add annotation', function () {
      var p = new pleeease({stylus: true, sourcemaps: true});
      var pre = new Preprocessor('a{a:a}', p.options);
      var result = pre.stylus();
      result.css.should.not.containEql('sourceMappingURL=');
    });

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

  describe('Throws errors', function () {

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
      (function () {
        return pleeease.process('$a=8;a{a:a}', opts);
      }).should.throw(/^Sass: parsing fails/);
    });
    it('using LESS', function () {
      opts.less = true;
      (function () {
        return pleeease.process('@a=8;a{a:a}', opts);
      }).should.throw(/^LESS: parsing fails/);
    });
    it('using Stylus', function () {
      opts.stylus = true;
      (function () {
        return pleeease.process('a:8;a{a:a}', opts);
      }).should.throw(/^Stylus: parsing fails/);
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

});
