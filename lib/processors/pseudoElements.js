'use strict';

/**
 *
 * Fallback pseudo-element syntax
 *
 */
module.exports.processor = function (css) {

    // the regexp
    var regexp = /:(:before|:after|:first-letter|:first-line)/g;

    // for each rules
    css.eachRule(function (rule) {

        if ( rule.selector.match(regexp) ) {

            // Replace in every pseudo-element rule
            rule.selector = rule.selector.replace(regexp, function(_, pseudo) {
                return pseudo;
            });

        }

    });

    return css;

};