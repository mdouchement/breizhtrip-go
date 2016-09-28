/* eslint-disable quotes, no-undef */
'use strict';

/**
* gulpfile.js
*
* Available tasks:
*   `gulp watch`
*   `gulp build`
*   `gulp assets:watch`
*   `gulp assets:clean`
*   `gulp assets:build`
*   `gulp assets:stylesheets`
*   `gulp assets:stylesheets:beautify`
*   `gulp assets:stylesheets:clean`
*   `gulp assets:javascripts`
*   `gulp assets:javascripts:beautify`
*   `gulp assets:javascripts:clean`
*   `gulp server:build`
*   `gulp server:spawn`
*   `gulp server:watch`
*
*    Options:
*    --dev                     : Add sourcemaps, refresh livereload
*
* Modules:
*   gulp                       : The streaming build system.
*   del                        : Delete files and folders.
*   child_process              : Spawn child process through Node.
*   gulp-autoprefixer          : Prefix CSS.
*   gulp-babel                 : Transpile ES6+ js files.
*   gulp-concat                : Concatenates files.
*   gulp-cleancss              : Minify CSS with clean-css.
*   gulp-csscomb               : Format and sort SCSS/CSS files with CSScomb
*   gulp-eslint                : Lint JS files with ESLint
*   gulp-livereload            : Reload web browser on demand
*   gulp-jsbeautifier          : Prettify JavaScript, JSON, HTML and CSS.
*   gulp-notify                : Notify system.
*   gulp-plumber               : Prevent pipe breaking caused by errors.
*   gulp-rename                : Rename files.
*   gulp-sass                  : Gulp plugin for sass.
*   gulp-scsslint              : Lint SCSS files with scss-lint.
*   gulp-sourcemaps            : Source map support for Gulp.js.
*   gulp-sync                  : Sync Gulp tasks.
*   gulp-uglify                : Minify files with UglifyJS.
*   gulp-util                  : Utility functions for gulp plugins.
*/

var gulp     = require('gulp'),
  autoprefix = require('gulp-autoprefixer'),
  livereload = require('gulp-livereload'),
  sourcemaps = require('gulp-sourcemaps'),
  prettify   = require('gulp-jsbeautifier'),
  cleancss   = require('gulp-clean-css'),
  scsslint   = require('gulp-scss-lint'),
  csscomb    = require('gulp-csscomb'),
  plumber    = require('gulp-plumber'),
  gulpif     = require('gulp-if'),
  eslint     = require('gulp-eslint'),
  notify     = require('gulp-notify'),
  concat     = require('gulp-concat'),
  rename     = require('gulp-rename'),
  uglify     = require('gulp-uglify'),
  gutil      = require('gulp-util'),
  babel      = require('gulp-babel'),
  child      = require('child_process'),
  sync       = require('gulp-sync')(gulp),
  sass       = require('gulp-sass'),
  args       = require('yargs').argv,
  del        = require('del');

/* ----------------------------------------------------------------------------
 * locals
 * ------------------------------------------------------------------------- */

var server = null;

var root = {
  src: './assets/',
  dest: './public/assets/'
};

var css = {
  src: 'stylesheets/',
  dest: 'stylesheets/',
  main: 'main.scss',
  watch: '**/*',
  include: [
    './node_modules/bulma'
  ]
};

var js = {
  src: 'javascripts/',
  dest: 'javascripts/',
  watch: '**/*'
};

var views = {
  src: 'views/',
  watch: '**/*.tmpl'
};

var go = {
  src: '*/**/*.go'
};

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Functions
 *
 * handleErrors                   : Send a notification to the system on error.
 */

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);

  notify.onError({
    title: '<%= error.plugin %> failed',
    message: '<%= error.message %>'
  }).apply(this, args);
  gutil.beep();
  this.emit('end');
}

/* ----------------------------------------------------------------------------
 * Assets
 * ------------------------------------------------------------------------- */

/**
* CSS Tasks
*
* assets:stylesheets             : Compile/sort/lint/sourcemap/autoprefix/minify SCSS files to one CSS file.
* assets:stylesheets:beautify    : Sort SCSS files.
* assets:stylesheets:clean       : Remove any CSS files in stylesheet dist folder.
*/

gulp.task('assets:stylesheets', function() {
  return gulp.src(root.src + css.src + css.main)
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(gulpif(args.dev, sourcemaps.init()))
    .pipe(csscomb())
    .pipe(scsslint())
    .pipe(sass({ includePaths: css.include }))
    .pipe(autoprefix({ browsers: ['last 2 versions'] }))
    .pipe(cleancss())
    .pipe(rename('stylesheet.min.css'))
    .pipe(gulpif(args.dev, sourcemaps.write()))
    .pipe(gulp.dest(root.dest + css.dest))
    .pipe(gulpif(args.dev, livereload()));
});

gulp.task('assets:stylesheets:beautify', function() {
  return gulp.src(root.src + css.src + css.watch)
   .pipe(plumber({ errorHandler: handleErrors }))
   .pipe(csscomb())
   .pipe(gulp.dest(root.src + css.src));
});

gulp.task('assets:stylesheets:clean', function() {
  return del([root.dest + css.dest]);
});

/**
* JS Tasks
*
* assets:javascripts             : Compile/beautify/lint/sourcemap/concat/minify JS files to one JS file.
* assets:javascripts:beautify    : Beautify JS files.
* assets:javascripts:clean       : Remove any JS files in javascript dist folder.
*/
gulp.task('assets:javascripts', function() {
  return gulp.src(root.src + js.src + js.watch)
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(gulpif(args.dev, sourcemaps.init()))
    .pipe(prettify())
    .pipe(eslint())
    .pipe(babel())
    .pipe(concat('javascript.js'))
    .pipe(uglify())
    .pipe(rename('javascript.min.js'))
    .pipe(gulpif(args.dev, sourcemaps.write()))
    .pipe(gulp.dest(root.dest + js.dest))
    .pipe(gulpif(args.dev, livereload()));
});

gulp.task('assets:javascripts:beautify', function() {
  return gulp.src(root.src + js.src + js.watch)
   .pipe(plumber({ errorHandler: handleErrors }))
   .pipe(prettify())
   .pipe(gulp.dest(root.src + js.src));
});

gulp.task('assets:javascripts:clean', function() {
  return del([root.dest + js.dest]);
});

/**
 * Global assets tasks
 *
 * assets:watch                   : Watch SCSS and JS files for changes and compile them.
 * assets:clean                   : Remove any files in CSS/JS dist folders.
 * assets:build                   : Clean/beautify/compile CSS/JS files.
 */

gulp.task('assets:watch', function() {
  gulp.watch([root.src + css.src + css.watch], ['assets:stylesheets']);
  gulp.watch([root.src + js.src + js.watch], ['assets:javascripts']);
});

gulp.task('assets:clean', [
  'assets:stylesheets:clean',
  'assets:javascripts:clean'
]);

gulp.task('assets:build', [
  'assets:clean',
  'assets:stylesheets:beautify',
  'assets:stylesheets',
  'assets:javascripts:beautify',
  'assets:javascripts',
]);

/* ----------------------------------------------------------------------------
 * Server
 * ------------------------------------------------------------------------- */

/**
* Global assets tasks
*
* server:build                   : Go install.
* server:spawn                   : Restart Go server.
* server:watch                   : Watch Go/tmpl files for changes and restart server.
*/

gulp.task('server:build', function() {
  var build = child.spawnSync('go', ['install']);

  // Log build errors
  if (build.stderr.length) {
    var lines = build.stderr
      .toString()
      .split('\n')
      .filter(function(line) {
        return line.length;
      });

    for (var l in lines) {
      gutil.log(
        gutil.colors.red('Error (go install): ' + lines[l])
      );
    }

    notify.notify({
      title: 'Error (go install)',
      message: lines
    });
  }

  return build;
});

gulp.task('server:spawn', function() {
  if (server) {
    server.kill();
  }

  server = child.spawn('go', ['run', 'breizhtrip.go', 'server', '-p', '5050'], { stdio: 'inherit' });

  livereload();
});

gulp.task('server:watch', function() {
  gulp.watch([views.src + views.watch], ['server:spawn']);
  gulp.watch(go.src, sync.sync([
    'server:build',
    'server:spawn'
  ]));
});

/* ----------------------------------------------------------------------------
 * Interface
 * ------------------------------------------------------------------------- */

/**
* Global tasks
*
* build                          : Build assets and server
* watch                          : Watch files for changes and execute their watch tasks.
*/

gulp.task('build', [
  'assets:build',
  'server:build'
]);

gulp.task('watch', ['build'], function() {
  livereload.listen();
  return gulp.start([
    'assets:watch',
    'server:watch',
    'server:spawn'
  ]);
});

/* eslint-enable quotes, no-undef */
