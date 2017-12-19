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
    var uglify     = require('gulp-uglify-es').default;
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
 *
 */
gulp.task('lint', function(cb) {
    var jshint = require('gulp-jshint');

    gulp.src(['lib/**/*.js', 'test/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .on('finish', cb);
});

/**
 *
 * Coding style
 * 
 */
gulp.task('jscs', function(cb) {
    var jscs = require('gulp-jscs');
    gulp.src(['lib/**/*.js', 'test/**/*.js'])
        .pipe(jscs())
        .on('finish', cb);
});

/**
 *
 * Test spec
 * `npm test` (without argv)
 * `gulp test --file cli` (test only cli.js file)
 *
 */
gulp.task('test', ['lint', 'jscs'], function () {
  require('should');
  require('should-promised');
  var mocha = require('gulp-mocha');
  var args = require('yargs').argv;
  var file = args.file || '*';

  gulp.src('test/' + file + '.js', {read: false})
    .pipe(mocha({reporter: 'spec'}))

});

/**
 *
 * Coverage
 *
 */
gulp.task('istanbul', function (cb) {
  require('should');
  require('should-promised');
  var istanbul = require('gulp-istanbul');
  var mocha    = require('gulp-mocha');
  gulp.src('lib/**/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src('test/*.js', {read: false})
        .pipe(mocha({reporter: 'spec'}))
        .pipe(istanbul.writeReports())
        .on('end', cb)
    });
})
gulp.task('coverage', ['istanbul'], function (cb) {
  var coveralls = require('gulp-coveralls');
  gulp.src('coverage/**/lcov.info')
    .pipe(coveralls());
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