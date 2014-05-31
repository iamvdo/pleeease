'use strict';

var fs      = require('fs'),
    path    = require('path'),
    postcss = require('postcss');

function Importer (dirname) {
    Importer.prototype.dirname = path.resolve(dirname);
}
Importer.prototype.processor = function (css) {

    // process CSS
    return process(css);

};
function process (style) {

    // create new rules
    var rules = [];

    // for each rule
    style.each(function (rule) {

        // get the filename
        var file = getFileIfAtImport(rule);

        // if it's an @import OK
        if (file) {

            // store dirname
            var dirname = path.dirname(file);

            // get the CSS from @import-ed file
            var processed = getCSSFromImportedFile(file);
            // resolve all @import url
            processed.eachAtRule(function (rule) {
                if (rule.name === 'import') {
                    var file = getFilename(rule.params);
                    // if @import don't contain media
                    if (file !== 'false') {
                        // resolve the path
                        rule.params = path.resolve(dirname, file);
                    }
                }
            });
            
            // store each rules
            processed.each(function (rule) {
                rules.push(rule);
            });

        } else {

            // this is not an @import, store the rule to the rules
            rules.push(rule);

        }

    });

    // replace all rules
    style.rules = rules;

    // if the file still have @import: process style
    if (hasImports(style)) {
        process(style);
    }

    return style;

}
function getCSSFromImportedFile (filename) {

    var data = fs.readFileSync(filename, 'utf8');
    var style = postcss.parse(data, {map: true, from: filename});

    return style;

}
function getFileIfAtImport (rule) {

    if (rule.type === 'atrule' && rule.name === 'import') {
        var file = getFilename(rule.params);
        // if @import don't contain media
        if (file !== 'false') {
            // resolve the path
            return path.resolve(Importer.prototype.dirname, file);
        } else {
            return false;
        }
    }

}
function hasImports (style) {

    var yes = false;

    style.eachAtRule(function (rule) {
        if (rule.name === 'import') {
            yes = getFileIfAtImport(rule);
        }
    });

    return yes;

}
function getFilename (params) {

    // search for the url
    var RE_URL = /^(url\(["\']?|["\']{1})(\S[^"\'\)]+)["\']?[\)]?(.*)/;
    // get the filename
    var file = params.replace(RE_URL, function(_, hash, url, media) {
        // if a media is specified OR if it's an URL: ignore @import
        if (media !== '' || /^[\s"\']*http/.test(url)) {
            return false;
        }
        return url;
    });
    // return file without "" or ''
    return file.replace(/^("|\')/, '').replace(/("|\')$/, '');

}

var importer = function(dirname) {
    return new Importer(dirname);
};
module.exports = importer;