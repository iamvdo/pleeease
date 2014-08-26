'use strict';

/**
 *
 * Fallback opacity property
 *
 */
module.exports.processor = function (css) {

  var PROP         = 'opacity';
  var PROP_REPLACE = 'filter';

  // for each rules, each decl
  css.eachRule(function (rule) {
    rule.eachDecl(function (decl) {

      if (decl.prop !== PROP) { return; }

      // get amount and create value
      var amount = Math.floor(decl.value * 100);
      var VAL_REPLACE  = 'alpha(opacity=' + amount + ')';

      // find if a filter opacity is already present
      var isFilterAlreadyPresent = false;
      rule.eachDecl(function (d) {
        if (d.prop === PROP_REPLACE && d.value === VAL_REPLACE) {
          isFilterAlreadyPresent = true;
        }
      });

      // adds new property only if it's not present yet
      if (!isFilterAlreadyPresent) {
        rule.insertAfter(decl, {prop: PROP_REPLACE, value: VAL_REPLACE});
      }

    });
  });

  return css;

};