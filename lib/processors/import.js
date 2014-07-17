'use strict';

var fs      = require('fs'),
    path    = require('path'),
    postcss = require('postcss');

/**
 *
 * Constructor Importer
 * @param {String} dirname
 *
 */
var Importer = function (dirname) {
    Importer.prototype.dirname = path.resolve(dirname);
    this.processor = this.processor.bind(this);
};

/**
 *
 * Processor
 * @param  {String} css
 * @return {String} root Processed css
 *
 */
Importer.prototype.processor = function (css) {

    // create a new Root
    var root = postcss.root();

    // process CSS
    var styles = this.process(css);

    // Copy all styles to Root
    styles.each(function (rule) {
        root.append(rule.clone());
    });

    return root;

};

/**
 *
 * Process stylesheet
 * @param  {String} style
 * @return {String}
 *
 */
Importer.prototype.process = function (style) {

    // create new rules
    var rules = [];

    // for each rule
    style.each(function (rule) {

        // get the filename if it's an @import
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
        this.process(style);
    }

    return style;

};

/**
 *
 * Get the path of a file if it's an `@import` rule
 * @param  {Object}         rule PostCSS Rule
 * @return {String|Boolean}      Returns path if filename exists or false
 *
 */
function getFileIfAtImport (rule) {

    // if it's an @import rule
    if (rule.type === 'atrule' && rule.name === 'import') {

        // get the filename
        var file = getFilename(rule.params);

        // if the file is OK
        if (file !== 'false') {
            // resolve the path
            return path.resolve(Importer.prototype.dirname, file);
        } else {
            return false;
        }

    }

}

/**
 *
 * Get the CSS from imported file
 * @param  {String} filename Path of the imported file
 * @return {String}
 *
 */
function getCSSFromImportedFile (filename) {

    try {
        var data = fs.readFileSync(filename, 'utf8');
        var style = postcss.parse(data, {map: true, from: filename});
        return style;
    } catch (err) {
        throw new Error('Resolving path failed for "' + path.basename(filename) + '"');
    }

}

/**
 *
 * Check if style have @import
 * @param  {String}  style
 * @return {Boolean}
 *
 */
function hasImports (style) {

    var yes = false;

    style.eachAtRule(function (rule) {
        if (rule.name === 'import') {
            yes = getFileIfAtImport(rule);
        }
    });

    return yes;

}

/**
 *
 * Extract filename from an @import declaration
 * @param  {String} params
 * @return {String}
 *
 */
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
    // return filename without "" or ''
    return file.replace(/^("|\')/, '').replace(/("|\')$/, '');

}

/**
 *
 * New Importer instance
 *
 */
var importer = function(dirname) {
    return new Importer(dirname);
};

/**
 *
 * Exports
 *
 */
module.exports = importer;