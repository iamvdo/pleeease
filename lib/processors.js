'use strict';

var rem            = require('pixrem');
var vmin           = require('postcss-vmin');
var filter         = require('pleeease-filters');
var opacity        = require('postcss-opacity');
var importer       = require('postcss-import');
var minifier       = require('csswring');
var mqpacker       = require('css-mqpacker');
var prefixer       = require('autoprefixer-core');
var urlifier       = require('postcss-url');
var pseudoElements = require('postcss-pseudoelements');

module.exports = function (options) {
  var opts;
  var processors = [];

  var processorsFn = [
    (opts = options.import)         ? importer(opts)                : false,
    (opts = options.rebaseUrls)     ? urlifier()                    : false,
    (opts = options.filters)        ? filter(opts).postcss          : false,
    (opts = options.rem)            ? rem.apply(null, opts).postcss : false,
    (opts = options.vmin)           ? vmin()                        : false,
    (opts = options.pseudoElements) ? pseudoElements()              : false,
    (opts = options.opacity)        ? opacity()                     : false,
    (opts = options.mqpacker)       ? mqpacker.postcss              : false,
    (opts = options.autoprefixer)   ? prefixer(opts)                : false,
    (opts = options.minifier)       ? minifier(opts).postcss        : false
  ];

  // remove false
  processorsFn.forEach(function (processor) {
    if (processor) {
      processors.push(processor);
    }
  });

  return processors;
};
