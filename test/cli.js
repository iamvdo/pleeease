'use strict';

var fs         = require('fs');
var path       = require('path');
var assert     = require('assert');
var exec       = require('child_process').exec;
var options    = require('../lib/options')().defaults;
var bin        = 'node ' + path.resolve(__dirname, '../bin/pleeease');
var readFile   = require('../test/_helpers.js').readFile;
var removeFile = require('../test/_helpers.js').removeFile;

var __dirname__ = 'test/cli/';
var __in__      = __dirname__ + 'in.css';
var __out__     = __dirname__ + 'out';

/**
 *
 * Describe CLI
 *
 */
describe('CLI', function () {

  var out = __out__;

  beforeEach(function() {

  });

  afterEach(function() {
    removeFile(out);
  });

  it('should read from input file and write to output file', function(done) {

    exec(bin + ' compile '+ __in__ + ' to '+ __out__, function (err, stdout) {
      if (err) return done(err);

      var input  = readFile(__in__);
      var output = readFile(__out__);

      assert.equal(output, input);

      done();

    });

  });

  it('should read directory of inputs files and write to output file', function(done) {

    exec(bin + ' compile test/cli to '+ __out__, function (err, stdout) {
      if (err) return done(err);

      // there's only one file in test/cli, so read it
      var input  = readFile(__in__);
      var output = readFile(__out__);

      assert.equal(output, input);

      done();

    });

  });

  it('should read from input file and write to default output file if omitted', function(done) {

    exec(bin + ' compile '+ __in__, function (err, stdout) {
      if (err) return done(err);

      var input  = readFile(__in__);
      var output = readFile(options.out);

      assert.equal(output, input);

      // remove default output file
      out = options.out;

      done();

    });

  });

  it('should read from .pleeeaserc file if input and/or output files are omitted', function(done) {

    // create a .pleeeaserc file
    var json = '{"in": ["in.css"], "out": "out"}';
    var pleeeaseRC = fs.writeFileSync(__dirname__ + '.pleeeaserc', json);

    exec('cd ' + __dirname__ + ' && node ../../bin/pleeease compile', function (err, stdout) {
      if (err) return done(err);

      var input  = readFile(__in__);
      var output = readFile(__out__);

      assert.equal(output, input);

      // remove .pleeeaserc file
      removeFile(__dirname__ + '.pleeeaserc');

      // remove output file
      out = __out__;

      done();

    });

  });

});