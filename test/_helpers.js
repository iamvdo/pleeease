'use strict';

var fs           = require('fs');
var options      = require('../lib/options')().defaults;
var pleeease     = require('../lib/');
var assert       = require('assert');
var __dirnames__ = {
  features: 'test/features/'
};

module.exports = {

  test: function (name, opts) {

    // css
    var css = fs.readFileSync(__dirnames__['features'] + name + '.css', 'utf-8');
    var expected = fs.readFileSync(__dirnames__['features'] + name + '.out.css', 'utf-8');

    if (typeof opts === 'undefined') {
      opts = options;
    } else if (opts.same) {
      expected = css;
    }

    // process
    var processed = pleeease.process(css, opts);

    if (typeof processed === 'object') {
      processed = processed.css;
    }

    assert.equal(processed,expected);

  },

  readFile: function (filename) {
    return fs.readFileSync(filename, 'utf-8');
  },

  removeFile: function (filename) {
    return fs.unlinkSync(filename);
  },

  requireWithoutCache: function (module) {
    var name = require.resolve(module);
    delete require.cache[name];
    return require(module);
  },

  dirname: __dirnames__

};