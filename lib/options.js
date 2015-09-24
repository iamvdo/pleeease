'use strict';

var extend = require('deep-extend');

/**
 *
 * Constructor Options
 *
 */
function Options () {

  this.configFile = '.pleeeaserc';

  /**
   *
   * Defaults options for pleeease
   *
   */
  this.defaults = {
    'sass':                 false,
    'less':                 false,
    'stylus':               false,

    'sourcemaps':           false,

    'autoprefixer':         true,
    'filters':              true,
    'rem':                  true,
    'pseudoElements':       true,
    'opacity':              true,
    'vmin':                 true,

    'import':               true,
    'rebaseUrls':           true,
    'mqpacker':             false,
    'minifier':             true,

    'modules':              true
  };

  /**
   *
   * Defaults values
   *
   */
  this.values = {
    'sass':                 {},
    'less':                 {syncImport: true},
    'stylus':               {},

    'sourcemaps':           {},

    'autoprefixer':         {},
    'filters':              {},
    'rem':                  {rootValue: '16px'},

    'import':               {},
    'mqpacker':             {},
    'minifier':             {preserveHacks: true},

    'modules':              {before: [], after: []}
  };

  /**
   *
   * Options
   *
   */
  this.options = this.extend(this.defaults);

}

/**
 *
 * isValidOptions
 * Check whether options are valid or not
 *
 */
Options.prototype.isValidOptions = function (opts) {

  // check preprocessors options
  if ((opts.sass   && (opts.less || opts.stylus)) ||
      (opts.less   && (opts.sass || opts.stylus)) ||
      (opts.stylus && (opts.sass || opts.less))) {
    throw new Error('You can\'t use more than one preprocessor');
  }

  return opts;

};
/**
 *
 * Extend values
 *
 */
Options.prototype.extendValues = function (opts, values) {

  for (var key in values) {
    var opt = opts[key];
    var val = values[key];

    if (opt === false) {
      continue;
    }
    if (opt === true) {
      opts[key] = val;
    } else if (typeof opt === 'object') {
      opts[key] = extend(opt, val);
    }
  }

  return opts;

};

/**
 *
 * Set Filenames
 * Read `in` and `out` properties, and copy them in `sourcemaps.from`
 * and `sourcemaps.to`, only if not present
 * Also set dummy filename when no files are found
 *
 */
Options.prototype.setFilenames = function (opts) {

  var from = '<no-source>';
  var to   = '<no-output>';

  if (!opts.sourcemaps && (opts.in || opts.out)) {
    opts.sourcemaps = {};
  }

  if (opts.sourcemaps) {
    if (opts.in) {
      if (!opts.sourcemaps.from) {
        opts.sourcemaps.from = opts.in;
      }
      delete opts.in;
    }
    if (opts.out) {
      if (!opts.sourcemaps.to) {
        opts.sourcemaps.to = opts.out;
      }
      delete opts.out;
    }
    if (!opts.sourcemaps.from) {
      opts.sourcemaps.from = from;
    }
    if (!opts.sourcemaps.to) {
      opts.sourcemaps.to = to;
    }
  }
  return opts;

};

/**
 *
 * Set Sourcemaps
 * Creates global and specific (preprocessors) sourcemaps options
 *
 */
Options.prototype.setSourcemaps = function (opts) {

  var sass   = (opts.sass   && opts.sass.sourceMap);
  var less   = (opts.less   && opts.less.sourceMap);
  var stylus = (opts.stylus && opts.stylus.sourcemap);

  // force global options when find specific
  if (sass || less || stylus) {
    if (!opts.sourcemaps) {
      opts.sourcemaps = true;
    }
  }

  // if global sourcemaps
  if (opts.sourcemaps) {
    if (opts.sourcemaps === true) {
      opts.sourcemaps = {map: true};
    }
    if (opts.sourcemaps.hasOwnProperty('map') && opts.sourcemaps.map === false) {
      delete opts.sourcemaps.map;
    }
  }
  if (opts.sourcemaps) {
    // if sourcemaps empty
    if (!(typeof opts.sourcemaps === 'object' && !opts.sourcemaps.hasOwnProperty('map'))) {
      // set inline
      if (opts.sourcemaps.map === true) {
        opts.sourcemaps.map = {
          inline: true
        };
      }
      if (typeof opts.sourcemaps.map === 'object') {
        if (!(opts.sourcemaps.map.hasOwnProperty('inline') && opts.sourcemaps.map.inline === false)) {
          opts.sourcemaps.map.inline = true;
        } else {
          if (opts.sourcemaps.map.annotation !== false) {
            opts.sourcemaps.map.annotation = true;
          }
        }
      }
      // set specific sourcemaps
      // and forces to have not inlined sourcemaps
      if (opts.sass) {
        if (opts.sass === true) {
          opts.sass = {};
        }
        opts.sass.sourceMap = true;
        opts.sass.sourceMapEmbed = false;
        opts.sass.omitSourceMapUrl = true;
      }
      if (opts.less) {
        if (opts.less === true) {
          opts.less = {};
        }
        // in LESS, sourceMap is an object
        if (opts.less.sourceMap && opts.less.sourceMap === true) {
          opts.less.sourceMap = {};
        }
        opts.less.sourceMap = opts.less.sourceMap || {};
        opts.less.sourceMap.sourceMapFileInline = false;
        opts.less.sourceMap.sourceMapURL = false;
      }
      if (opts.stylus) {
        if (opts.stylus === true) {
          opts.stylus = {};
        }
        // in Stylus, sourcemap is an object
        if (opts.stylus.sourcemap && opts.stylus.sourcemap === true) {
          opts.stylus.sourcemap = {};
        }
        opts.stylus.sourcemap = opts.stylus.sourcemap || {};
        opts.stylus.sourcemap.inline = false;
        opts.stylus.sourcemap.comment = false;
      }
    }
  }

  return opts;

};

/**
 *
 * Set Browsers
 * Override specific options when browsers option is set
 *
 */
Options.prototype.setBrowsers = function (opts) {

  if (opts.browsers) {
    if (!Array.isArray(opts.browsers)) {
      opts.browsers = [opts.browsers];
    }
    var _opts = {
      browsers: opts.browsers
    };
    var Browsers = require('./browsers');
    var browsers = new Browsers(_opts);
    var find = [];
    for (var i = browsers.selected.length - 1; i >= 0; i--) {
      var browserSelected = browsers.selected[i];
      for (var feature in browsers.features) {
        if (find[feature]) {
          continue;
        }
        find[feature] = false;
        for (var j = browsers.features[feature].length - 1; j >= 0; j--) {
          var browserCompat = browsers.features[feature][j];
          if (browserCompat === browserSelected) {
            find[feature] = true;
            opts[feature] = true;
            break;
          }
        }
        if (!find[feature]) {
          opts[feature] = false;
        }
      }
    }
  }

  return opts;

};

/**
 *
 * Set Autoprefixer browsers
 *
 */
Options.prototype.setAutoprefixerBrowsers = function (opts) {
  if (opts.browsers && opts.autoprefixer && !opts.autoprefixer.browsers) {
    opts.autoprefixer.browsers = opts.browsers;
  }
  return opts;
};

/**
 *
 * Extend options
 *
 */
Options.prototype.extend = function (opts) {

  var options = this.options || this.defaults;

  // extend options
  options = extend(options, opts);

  // override options with browsers' one
  options = this.setBrowsers(options);

  // set global & specific sourcemaps options
  options = this.setSourcemaps(options);

  // extend values
  options = this.extendValues(options, this.values);

  // set filenames in sourcemaps options
  options = this.setFilenames(options);

  // add browsers to Autoprefixer, only if not defined
  options = this.setAutoprefixerBrowsers(options);

  return this.isValidOptions(options);

};

/**
 *
 * New Options instance
 *
 */
var options = function() {
  return new Options();
};

/**
 *
 * Exports
 *
 */
module.exports = options;
