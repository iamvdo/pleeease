'use strict';

var Pleeease     = require('../lib/pleeease'),
    Options      = require('../lib/options'),
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
 * Constructor CLI
 *
 */
var CLI = function () {

    this.options = new Options().options;

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
CLI.prototype.init = function (fn, inputs, output) {

    var _cli = this;

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

            _cli.compile(results, output);

        } else if ('watch' === fn) {

            _cli.watch(results, output);

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
 *
 */
CLI.prototype.compile = function (inputs, output) {

    var pleeease = new Pleeease(this.options);

    // create a new (future) Root AST
    var root;

    // get inputs files
    inputs.map(function(filename) {

        // read, parse and concatenate rules to Root AST
        var filestring = fs.readFileSync(filename).toString();

        var fileAst = pleeease.parse(filestring, filename);

        // create the final AST
        if (root === undefined) {
            root = fileAst;
        } else {
            fileAst.each(function(rule) {
                root.append(rule.clone());
            });
        }

    });

    var fixed = pleeease.process(root);

    // create directory if not exists
    mkdirp(path.dirname(output), function (err) {

        if (err) {
            console.log(err);
        } else {
            // write processed file
            fs.writeFileSync(output, fixed);
        }

    });

};

/**
 *
 * Watch all files, and write processed file when a change is detected
 * @param  {Array}  inputs  Array of all inputs files
 * @param  {String} output  Name of output file
 *
 */
CLI.prototype.watch = function (inputs, output) {

    var _cli = this;

    // compile first
    _cli.compile(inputs, output);

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
            _cli.compile(inputs, output);

            // log
            console.log('Pleeease'.pleeease,'Watch'.success, 'File', path, 'has been modified. Now recompiled.');

        });

    // log
    console.log('Pleeease'.pleeease,'Watcher is running...');

};

/**
 *
 * New CLI instance
 *
 */
var cli = function() {
    return new CLI();
};

/**
 *
 * Exports
 *
 */
module.exports = cli;