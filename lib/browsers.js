'use strict';

var Autoprefixer = require('autoprefixer-core');

/**
 *
 * Constructor Browsers
 *
 */
function Browsers (options) {

    var autoprefixer = Autoprefixer(options);

    this.selected = autoprefixer.prefixes.browsers.selected;
    this.browsers = autoprefixer.prefixes.browsers.data;

    var features = {};

    this.getBrowsersByFeature('rem', function(browsers) {
        features.rem = browsers;
    });
    this.getBrowsersByFeature('css-opacity', function(browsers) {
        features.opacity = browsers;
    });
    this.getBrowsersByFeature('css-gencontent', function(browsers) {
        features.pseudoElements = browsers;
    });

    this.features = features;

}

/**
 *
 * getBrowsersByFeature from canIuse database
 * (mostly from autoprefixer-core/data/prefixes.js)
 *
 */
Browsers.prototype.getBrowsersByFeature = function(feature, callback) {
    var match = /(n|a)($|\s)/;
    var need = [];
    var data = require('autoprefixer-core/node_modules/caniuse-db/features-json/' + feature).stats;
    for (var browser in data) {
      var versions = data[browser];
      for (var interval in versions) {
        var support = versions[interval];
        var dbl = interval.split('-');
        for (var i = 0, len = dbl.length; i < len; i++) {
          var version = dbl[i];
          if (this.browsers[browser] && support.match(match)) {
            version = version.replace(/\.0$/, '');
            need.push(browser + ' ' + version);
          }
        }
      }
    }
    var sorted = need.sort(function(a, b) {
      a = a.split(' ');
      b = b.split(' ');
      if (a[0] > b[0]) {
        return 1;
      } else if (a[0] < b[0]) {
        return -1;
      } else {
        return parseFloat(a[1]) - parseFloat(b[1]);
      }
    });
    return callback(sorted);
};


/**
 *
 * New Browsers instance
 *
 */
var browsers = function(options) {
    return new Browsers(options);
};

/**
 *
 * Exports
 *
 */
module.exports = browsers;