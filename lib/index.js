var postcss  = require('postcss'),
    prefixer = require('autoprefixer'),
    minifier = require('csswring'),
    vars     = require('postcss-vars'),
    rem      = require('pixrem'),
    mqpacker = require('css-mqpacker'),
    extend   = require('deep-extend');

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
    if (_options = config.fallbacks) {

        for(var fallback in _options) {

            if (_options[fallback] !== false) {

                switch (fallback) {

                    // variables
                    case 'variables':
                        pipeline = usePlugin(vars, 'processor');
                        break;

                    // rem
                    case 'rem':
                        pipeline = usePlugin(rem, 'postcss', _options[fallback]);
                        break;

                }

            }

        }

    }
    // mqpacker
    if (config.mqpacker) {
        pipeline = usePlugin(mqpacker, 'processor');
    }
    // prefixer
    if (_options = config.autoprefixer) {
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