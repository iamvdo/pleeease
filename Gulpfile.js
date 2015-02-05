var fs          = require('fs-extra');
var gulp        = require('gulp');
var runSequence = require('run-sequence');

/**
 *
 * Clean standalone
 *
 */
gulp.task('clean', function (done) {
    fs.remove('./standalone', done);
});

/**
 *
 * Create a standalone version of pleeease
 * ./standalone/pleeease-<version>.min.js
 *
 */
gulp.task('standalone', ['clean'], function() {
    var fs         = require('fs');
    var source     = require('vinyl-source-stream');
    var uglify     = require('gulp-uglify');
    var streamify  = require('gulp-streamify');
    var browserify = require('browserify');

    var version = JSON.parse(fs.readFileSync('package.json', 'utf-8'))['version'];

    return browserify({entries: './lib/pleeease.js', standalone: 'pleeease'})
          .ignore('node-sass')
          .ignore('less')
          .ignore('mime')
          .ignore('stylus')
          .bundle()
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

    gulp.src(['bin/**/*.js', 'lib/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
gulp.task('lint:tests', function() {
    var jshint = require('gulp-jshint');

    gulp.src(['tests/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
gulp.task('lint', ['lint:lib', 'lint:tests']);

/**
 *
 * Test spec
 * `npm test` (without argv)
 * `gulp test --file cli` (test only cli.js file)
 *
 */
gulp.task('test', function () {
    require('should');
    var mocha = require('gulp-mocha');
    var args = require('yargs').argv;
    var file = args.file || '*';

    return gulp.src('test/' + file + '.js', {read: false})
          .pipe(mocha({reporter: 'spec'}));
});

/**
 *
 * Bump version
 * gulp bump --type <patch, minor, major>
 *
 */
gulp.task('_bump', function () {
    var bump = require('gulp-bump');
    var args = require('yargs').argv;

    return gulp.src('package.json')
            .pipe(bump({ type: args.type }))
            .pipe(gulp.dest('./'));

});
gulp.task('bump', function (cb) {

    runSequence('_bump', 'standalone', cb);

});