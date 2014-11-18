'use strict';

var pleeease     = require('../lib/'),
    options      = require('../lib/options')().defaults,
    fs           = require('fs'),
    path         = require('path'),
    multiglob    = require('multi-glob'),
    chokidar     = require('chokidar'),
    mkdirp       = require('mkdirp'),
    colors       = require('colors');
    colors.setTheme({pleeease: 'inverse', success: 'green',warn: 'yellow',error: 'red'});

/**
 *
 * Walk a path and return all files
 * @param  {String} dir     Directory to walk into
 * @return {Array}  results Array of files
 *
 */
var walk = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
};

/**
 *
 * Initialize CLI
 * Get the files, then call `compile` or `watch` method
 * @param  {String} fn     Name of method to call: `compile` or `watch`
 * @param  {Array}  inputs Array of input files or String
 * @param  {String} output Name of output file
 *
 */
var init = function (fn, inputs, output) {

    multiglob.glob(inputs, function (err, files) {

        if (!files.length) {
            // log fail
            console.log('Pleeease'.pleeease,'Compile'.error,'No files found.');
            return;
        }

        var results = [];

        // for each file / dir in arguments
        for (var i = 0; i < files.length; i++) {

            // if it's a directory
            if (fs.statSync(files[i]).isDirectory()) {
                // walk path and get all files
                results = results.concat(walk(files[i]));
            } else {
                // it's a file
                results.push(files[i]);
            }

        }

        // remove output from inputs
        if (results.indexOf(output) !== -1) {
            results.splice(results.indexOf(output), 1);
        }

        if (err) {
            throw err;
        }

        if ('compile' === fn) {

            compile(results, output, options);

        } else if ('watch' === fn) {

            watch(results, output, options);

        }

        // log
        console.log('Pleeease'.pleeease,'Compile'.success,results.length,'file(s) [' + results + '] compiled to',output);

    });

};

/**
 *
 * Compile all inputs files and write output file
 * @param  {Array}  inputs  Array of all inputs files
 * @param  {String} output  Name of output file
 * @param  {Object} options
 *
 */
var compile = function (inputs, output, options) {

    var postcss  = require('postcss');

    // create a new (future) Root AST
    var root;

    // get inputs files
    inputs.map(function(input) {

        // read, parse and concatenate rules to Root AST
        var fileString = fs.readFileSync(input).toString();
        var fileAst = postcss.parse(fileString, {map: true, from: input});

        // create the final AST
        if (root === undefined) {
            root = fileAst;
        } else {
            fileAst.each(function(rule) {
                root.append(rule.clone());
            });
        }

    });

    // process Root AST
    var fixedCSS = pleeease.process(root, options);

    // create directory if not exists
    mkdirp(path.dirname(output), function (err) {

        if (err) {
            console.log(err);
        } else {
            // write processed file
            fs.writeFileSync(output, fixedCSS);
        }

    });

};

/**
 *
 * Watch all files, and write processed file when a change is detected
 * @param  {Array}  inputs  Array of all inputs files
 * @param  {String} output  Name of output file
 * @param  {Object} options
 *
 */
var watch = function (inputs, output, options) {

    // compile first
    compile(inputs, output, options);

    // ignore all files that don't end with .css + output file
    var ignore = function (path) {
        return (path.match(/\.css$/) && path === output);
    };

    /**
     *
     * Watcher
     * - Watch `.` path
     * - Ignore `ignore` files
     * - Is `persistent`
     * - `usePolling` (needed for some text editors)
     *
     */
    var watcher = chokidar.watch(['.'], {ignored: ignore, persistent: true, usePolling: true});
        watcher
        .on('change', function(path) {

            // when a change is detected, compile files
            compile(inputs, output, options);

            // log
            console.log('Pleeease'.pleeease,'Watch'.success, 'File', path, 'has been modified. Now recompiled.');

        });

    // log
    console.log('Pleeease'.pleeease,'Watcher is running...');

};


/**
 *
 * Exports
 *
 */
module.exports = {
    init:    init,
    compile: compile,
    watch:   watch
};