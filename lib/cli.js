'use strict';

var pleeease     = require('../lib/'),
    options      = require('../lib/options'),
    fs           = require('fs'),
    path         = require('path'),
    multiglob    = require('multi-glob'),
    chokidar     = require('chokidar'),
    mkdirp       = require('mkdirp'),
    colors       = require('colors');
    colors.setTheme({pleeease: 'inverse', success: 'green',warn: 'yellow',error: 'red'});

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
            compile(results, output, options);
            watch(results, output, options);
        }

        // log
        console.log('Pleeease'.pleeease,'Compile'.success,results.length,'file(s) [' + results + '] compiled to',output);

    });

};

var compile = function (inputs, output, options) {

    var postcss  = require('postcss'),
        importer = require('../lib/processors/import');

    // get inputs files
    var CSS = inputs.map(function(input) {

        // @import option enabled
        if (options.optimizers.import) {
            return postcss().
                    use(importer(path.dirname(input)).processor).
                    process(fs.readFileSync(input).toString()).
                    css;
        } else {
            return fs.readFileSync(input).toString();
        }

    });

    // fixed CSS
    var fixedCSS = pleeease.process(CSS.join('\n'), options);

    // create directory if not exists
    mkdirp(path.dirname(output), function (err) {

        if (err) {
            console.log(err);
        } else {
            // write new file
            fs.writeFileSync(output, fixedCSS);
        }

    });

};

var watch = function (inputs, output, options) {

    // log
    console.log('Pleeease'.pleeease,'Watcher is running...');

    // set the watcher
    var watcher = chokidar.watch(inputs, {ignored: /[\/\\]\./, persistent: true, usePolling: true});
        watcher
        .on('change', function(path) {

            // when a change is detected, compile files
            compile(inputs, output, options);

            // log
            console.log('Pleeease'.pleeease,'Watch'.success, 'File', path, 'has been modified. Now recompiled.');

        });

};

exports.init = init;
exports.compile = compile;
exports.watch = watch;