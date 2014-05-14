var fs = require('fs'),
		path = require('path'),
		postcss = require('postcss');

var RE_import = /^url\((\S+)\)(.*)/

function Importer (dirname) {
	Importer.prototype.dirname = path.resolve(dirname);
}
Importer.prototype.processor = function (css) {

	expand(css);

	return css;

};
function expand (style) {

	// create a new CSS
	var newCSS = postcss.root();

	// for each rule
	style.each(function (rule) {

		// if it's an @import
		if (isImport(rule)) {

			// get the filename and store dirname
			var file = getFilename(rule.params);
			var dirname = path.dirname(file);

			// get the CSS from file
			var expanded = getCSSFromImportedFile(file);
			// resolve all @import url
			expanded.eachAtRule(function (rule) {
				if (rule.name === 'import') {
					rule.params = rule.params.replace(RE_import, function(_, url, media) {
						return path.resolve(dirname,url);
					});
				};
			});

			// concat rules with new CSS
			newCSS.rules = newCSS.rules.concat( expanded.rules );

		} else {

			// this is not an @import, so append the rule to the new CSS
			newCSS.append(rule);

		}

	});

	// copy all the rules
	style.rules = newCSS.rules;

	// if the file still have @import: expand it
	if (hasImports(style)) {
		expand(style);
	};
}
function getCSSFromImportedFile (filename) {

	var data = fs.readFileSync(filename, 'utf8');
	var style = postcss.parse(data);

	return style;

}
function isImport (rule) {

	var yes = false;

	if (rule.name === 'import') {
		var file = getFilename(rule.params);
		if (file !== 'false') {
			yes = true;
		}
	}

	return yes;

}
function hasImports (style) {

	var yes = false;

	style.eachAtRule(function (rule) {
		yes = isImport(rule);
	});

	return yes;

}
function getFilename (params) {

	// get the filename
	var file = params.replace(RE_import, function(_, url, media) {
		// if a media is specified, don't inline @import
		if (media) {
			return false;
		}

		return url.replace(/^("|\')/, '').replace(/("|\')$/, '');
	});

	// if @import don't contain media
	if (file !== 'false') {

		// resolve the path
		file = path.resolve(Importer.prototype.dirname, file);

	}

	return file;

}

var importer = function(dirname) {
	return new Importer(dirname);
};
module.exports = importer;