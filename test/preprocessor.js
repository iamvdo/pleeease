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
      var p = new pleeease.processor({sass: true, sourcemaps: true});
      var pre = new Preprocessor('a{a:a}', p.options);
      var result = pre.sass();
      result.css.should.not.containEql('sourceMappingURL=');
    });

  });

  describe('#less', function () {

    it('doesn\'t add annotation', function () {
      var p = new pleeease.processor({less: true, sourcemaps: true});
      var pre = new Preprocessor('a{a:a}', p.options);
      var result = pre.less();
      result.css.should.not.containEql('sourceMappingURL=');
    });

  });

  describe('#stylus', function () {

    it('doesn\'t add annotation', function () {
      var p = new pleeease.processor({stylus: true, sourcemaps: true});
      var pre = new Preprocessor('a{a:a}', p.options);
      var result = pre.stylus();
      result.css.should.not.containEql('sourceMappingURL=');
    });

  });

  describe('Processes plain ol\' CSS', function () {

    var css, expected;

    beforeEach(function () {
      css      = fs.readFileSync(dirname + 'css.css', 'utf-8');
      expected = fs.readFileSync(dirname + 'css.out.css', 'utf-8');
      opts.import = {path: dirname};
    });

    it('using Sass', function (done) {
      opts.sass = true;
      pleeease.process(css, opts).then(function (result) {
        result.should.eql(expected);
        done();
      }).catch(done);
    });
    it('using LESS', function (done) {
      opts.less = true;
      pleeease.process(css, opts).then(function (result) {
        result.should.eql(expected);
        done();
      }).catch(done);
    });
    it('using Stylus', function (done) {
      opts.stylus = true;
      pleeease.process(css, opts).then(function (result) {
        result.should.eql(expected);
        done();
      }).catch(done);
    });

  });

  describe('Throws errors', function () {

    var css, expected;

    beforeEach(function () {
      css      = fs.readFileSync(dirname + 'css.css', 'utf-8');
      expected = fs.readFileSync(dirname + 'css.out.css', 'utf-8');
      opts.import = {path: dirname};
    });

    it('using Sass', function (done) {
      opts.sass = true;
      pleeease.process('$a=8;a{a:a}', opts).then(function () {
        done('should not run');
      }).catch(function (error) {
        error.should.be.an.instanceOf(Error);
        error.should.have.property('message').startWith('Sass: parsing fails');
        done();
      }).catch(done);
    });
    it('using LESS', function (done) {
      opts.less = true;
      pleeease.process('@a=8;a{a:a}', opts).then(function () {
        done('should not run');
      }).catch(function (error) {
        error.should.be.an.instanceOf(Error);
        error.should.have.property('message').startWith('LESS: parsing fails');
        done();
      }).catch(done);
    });
    it('using Stylus', function (done) {
      opts.stylus = true;
      pleeease.process('a:8;a{a:a}', opts).then(function () {
        done('should not run');
      }).catch(function (error) {
        error.should.be.an.instanceOf(Error);
        error.should.have.property('message').startWith('Stylus: parsing fails');
        done();
      }).catch(done);
    });

  });

  describe('Compiles', function () {

    var css, expected;

    beforeEach(function () {
      expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');
    });

    it('using Sass', function (done) {
      opts.sass = true;
      css       = fs.readFileSync(dirname + 'sass/preproc.scss', 'utf-8');
      pleeease.process(css, opts).then(function (result) {
        result.should.eql(expected);
        done();
      }).catch(done);
    });
    it('using LESS', function (done) {
      opts.less = true;
      css       = fs.readFileSync(dirname + 'less/preproc.less', 'utf-8');
      pleeease.process(css, opts).then(function (result) {
        result.should.eql(expected);
        done();
      }).catch(done);
    });
    it('using Stylus', function (done) {
      opts.stylus = true;
      css         = fs.readFileSync(dirname + 'stylus/preproc.styl', 'utf-8');
      pleeease.process(css, opts).then(function (result) {
        result.should.eql(expected);
        done();
      }).catch(done);
    });

  });

  describe('Imports', function () {

    var css, expected;

    beforeEach(function () {
      expected = fs.readFileSync(dirname + 'preproc.out.css', 'utf-8');
    });

    it('files using Sass', function (done) {
      css       = fs.readFileSync(dirname + 'sass/import.scss', 'utf-8');
      opts.sass = {
        includePaths: ['test/preprocessors/sass']
      };
      pleeease.process(css, opts).then(function (result) {
        result.should.eql(expected);
        done();
      }).catch(done);
    });
    it('files using LESS', function (done) {
      css       = fs.readFileSync(dirname + 'less/import.less', 'utf-8');
      opts.less = {
        paths: ['test/preprocessors/less']
      };
      pleeease.process(css, opts).then(function (result) {
        result.should.eql(expected);
        done();
      }).catch(done);
    });
    it('files using Stylus', function (done) {
      css         = fs.readFileSync(dirname + 'stylus/import.styl', 'utf-8');
      opts.stylus = {
        paths: ['test/preprocessors/stylus']
      };
      pleeease.process(css, opts).then(function (result) {
        result.should.eql(expected);
        done();
      }).catch(done);
    });

  });

});
