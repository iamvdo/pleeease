'use strict';

var fs         = require('fs'),
    path       = require('path'),
    extend     = require('deep-extend');

var configFile = '.pleeeaserc';

/**
 * 
 * Defaults options for pleeease
 * 
 */
var options = {
    'in': ['*.css'],
    'out': 'app.min.css',

    'sourcemaps': false,

    'fallbacks': {
        'autoprefixer': true,
        'variables': true,
        'filters': true,
        'rem': true,
        'pseudoElements': true
    },
    'optimizers': {
        'import': true,
        'mqpacker': true,
        'minifier': true
    }
};

// extend options if a .pleeeaserc config file is present
if (fs.existsSync !== undefined && path.existsSync !== undefined) {

    if ((fs.existsSync || path.existsSync)(configFile)) {
        var config = JSON.parse(fs.readFileSync(configFile));

        options = extend(options, config);

    }

}

/**
 * 
 * Exports
 * 
 */
module.exports = options;