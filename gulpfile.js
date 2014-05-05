'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('scripts', function () {
    return gulp.src(['**/*.js', '!node_modules/**/*.js'])
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter('default'));
});