module.exports.processor = function (css) {

	// the regexp
	var regexp = /:(:before|:after|:first-letter|:first-line)/g;

	// for each rules
	css.eachRule(function (rule) {

		if ( rule.selector.match(regexp) ) {

			// In every ::before/::after rule
			rule.selector = rule.selector.replace(regexp, function(_, pseudo) {
				return pseudo;
			});

		}

	});

	return css;

};