var gulp = require('gulp');

/**
 *
 * Create a standalone version of pleeease
 * ./standalone/pleeease-<version>.min.js
 *
 */
gulp.task('standalone', function() {
    var fs         = require('fs');
    var source     = require('vinyl-source-stream');
    var uglify     = require('gulp-uglify');
    var streamify  = require('gulp-streamify');
    var browserify = require('browserify');

    var version = JSON.parse(fs.readFileSync('package.json', 'utf-8'))['version'];

    return browserify('./lib/index.js')
          .bundle({standalone: 'pleeease'})
          .pipe(source('pleeease-' + version + '.min.js'))
          .pipe(streamify(uglify()))
          .pipe(gulp.dest('./standalone'));
});

/**
 *
 * Lint JS files
 * lint:lib, lint:tests and lint
 *
 */
gulp.task('lint:lib', function() {
    var jshint = require('gulp-jshint');

    gulp.src(['bin/*.js', 'lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
gulp.task('lint:tests', function() {
    var jshint = require('gulp-jshint');

    gulp.src(['spec/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
gulp.task('lint', ['lint:lib', 'lint:tests']);


/**
 *
 * Test spec
 *
 */
gulp.task('test', function () {
    var jasmine = require('gulp-jasmine');

    return gulp.src('spec/*.js')
          .pipe(jasmine());
});