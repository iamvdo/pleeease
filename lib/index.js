'use strict';

var postcss        = require('postcss'),
    prefixer       = require('autoprefixer'),
    minifier       = require('csswring'),
    mqpacker       = require('css-mqpacker'),
    vars           = require('postcss-vars'),
    rem            = require('pixrem'),
    pseudoElements = require('../lib/processors/pseudoElements'),
    extend         = require('deep-extend');

var config,
    pipeline;

var usePlugin = function (name, fn, options) {

    if (options === undefined) {
        return pipeline.use(name[fn]);
    } else if (options === true) {
        return pipeline.use(name()[fn]);
    } else {
        return pipeline.use(name.apply(null, options)[fn]);
    }

};

function Pleeease (options) {

    var defaults = require('../lib/options');
    config = extend(defaults, options);

}

Pleeease.prototype.process = function (css) {

    var _options;

    pipeline = postcss();

    // fallbacks
    _options = config.fallbacks;
    if (_options) {

        for (var fallback in _options) {

            if (_options.hasOwnProperty(fallback) && _options[fallback] !== false) {

                switch (fallback) {

                    // variables
                    case 'variables':
                        pipeline = usePlugin(vars, 'processor');
                        break;

                    // rem
                    case 'rem':
                        pipeline = usePlugin(rem, 'postcss', _options[fallback]);
                        break;

                    // pseudo-elements
                    case 'pseudoElements':
                        pipeline = usePlugin(pseudoElements, 'processor');
                }

            }

        }

    }

    // mqpacker
    if (config.mqpacker) {
        pipeline = usePlugin(mqpacker, 'processor');
    }

    // prefixer
    _options = config.autoprefixer;
    if (_options) {
        pipeline = usePlugin(prefixer, 'postcss', _options);
    }

    // minifier
    if (config.minifier) {
        pipeline = usePlugin(minifier, 'processor');
    }

    return pipeline.process(css).css;

};

var pleeease = function(options) {
    return new Pleeease(options);
};
pleeease.process = function(css, options) {
    return new Pleeease(options).process(css);
};
module.exports = pleeease;