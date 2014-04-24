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

    // prefixer
    if (_options = config.autoprefixer) {
        pipeline = usePlugin(prefixer, 'postcss', _options);
    }
    // minifier
    if (config.minifier) {
        pipeline = usePlugin(minifier, 'processor');
    }
    // mqpacker
    if (config.mqpacker) {
        pipeline = usePlugin(mqpacker, 'processor');
    }
    // polyfills
    if (_options = config.polyfills) {

        for(var polyfill in _options) {

            if (_options[polyfill] !== false) {

                switch (polyfill) {

                    // variables
                    case 'variables':
                        pipeline = usePlugin(vars, 'processor');
                        break;

                    // rem
                    case 'rem':
                        pipeline = usePlugin(rem, 'postcss', _options[polyfill]);
                        break;

                }

            }

        }

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