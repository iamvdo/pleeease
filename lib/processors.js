'use strict';

var rem            = require('pixrem');
var vmin           = require('postcss-vmin');
var filter         = require('pleeease-filters');
var opacity        = require('postcss-opacity');
var importer       = require('postcss-import');
var minifier       = require('csswring');
var mqpacker       = require('css-mqpacker');
var prefixer       = require('autoprefixer');
var urlifier       = require('postcss-url');

var pseudoElements = require('postcss-pseudoelements');

module.exports = function (options) {

  var opts;

  var before = [
    (opts = options.import)         ? importer(opts)       : false,
    (opts = options.rebaseUrls)     ? urlifier()           : false
  ];

  var middle = [
    (opts = options.filters)        ? filter(opts).postcss : false,
    (opts = options.rem)            ? rem(opts)            : false,
    (opts = options.vmin)           ? vmin()               : false,
    (opts = options.pseudoElements) ? pseudoElements()     : false,
    (opts = options.opacity)        ? opacity()            : false,
    (opts = options.mqpacker)       ? mqpacker(opts)       : false,
    (opts = options.autoprefixer)   ? prefixer(opts)       : false
  ];

  var after = [
    (opts = options.minifier)       ? minifier(opts)       : false
  ];

  var beforeModules = [];
  if (options.modules && options.modules.before.length) {
    beforeModules = options.modules.before;
  }

  var afterModules = [];
  if (options.modules && options.modules.after.length) {
    afterModules = options.modules.after;
  }

  var processors = [].concat(before, beforeModules, middle, afterModules, after);

  // remove false
  return processors.filter(function (processor) {
    return processor;
  });

};
