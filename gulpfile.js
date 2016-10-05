'use strict'

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
*   `gulp assets:stylesheets:format`
*   `gulp assets:stylesheets:clean`
*   `gulp assets:javascripts`
*   `gulp assets:javascripts:format`
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
*   args                       : Add arguments support.
*   child_process              : Spawn child process through Node.
*   del                        : Delete files and folders.
*   gulp-autoprefixer          : Prefix CSS.
*   gulp-babel                 : Transpile ES6+ js files.
*   gulp-cleancss              : Minify CSS with clean-css.
*   gulp-concat                : Concatenates files.
*   gulp-csscomb               : Format and sort SCSS/CSS files with CSScomb.
*   gulp-if                    : Conditionally run a task.
*   gulp-livereload            : Reload web browser on demand.
*   gulp-notify                : Notify system.
*   gulp-plumber               : Prevent pipe breaking caused by errors.
*   gulp-rename                : Rename files.
*   gulp-sass                  : Gulp plugin for sass.
*   gulp-sourcemaps            : Source map support for Gulp.js.
*   gulp-standard              : JS linter.
*   gulp-standardFormat        : Format JS files using standard rules.
*   gulp-stylefmt              : Format CSS/SCSS files using stylelint rules.
*   gulp-stylelint             : CSS/SCSS linter.
*   gulp-sync                  : Sync Gulp tasks.
*   gulp-uglify                : Minify files with UglifyJS.
*   gulp-util                  : Utility functions for gulp plugins.
*/

var args = require('yargs').argv
var autoprefix = require('gulp-autoprefixer')
var babel = require('gulp-babel')
var child = require('child_process')
var cleancss = require('gulp-clean-css')
var concat = require('gulp-concat')
var csscomb = require('gulp-csscomb')
var del = require('del')
var gulp = require('gulp')
var gulpif = require('gulp-if')
var gutil = require('gulp-util')
var livereload = require('gulp-livereload')
var notify = require('gulp-notify')
var plumber = require('gulp-plumber')
var rename = require('gulp-rename')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var standard = require('gulp-standard')
var standardFormat = require('gulp-standard-format')
var stylefmt = require('gulp-stylefmt')
var stylelint = require('gulp-stylelint')
var sync = require('gulp-sync')(gulp)
var uglify = require('gulp-uglify')

/* ----------------------------------------------------------------------------
 * locals
 * ------------------------------------------------------------------------- */

var server = null

var root = {
  src: './assets/',
  dest: './public/assets/'
}

var css = {
  src: 'stylesheets/',
  dest: 'stylesheets/',
  main: 'main.scss',
  watch: '**/*',
  include: [
    './node_modules/bulma'
  ]
}

var js = {
  src: 'javascripts/',
  dest: 'javascripts/',
  watch: '**/*',
  ignore: [
    '*/**~'
  ]
}

var views = {
  src: 'views/',
  watch: '**/*.tmpl'
}

var go = {
  src: '*/**/*.go'
}

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Functions
 *
 * handleErrors                   : Send a notification to the system on error.
 */

function handleErrors () {
  var args = Array.prototype.slice.call(arguments)

  notify.onError({
    title: '<%= error.plugin %> failed',
    message: '<%= error.message %>'
  }).apply(this, args)
  gutil.beep()
  this.emit('end')
}

/* ----------------------------------------------------------------------------
 * Assets
 * ------------------------------------------------------------------------- */

/**
* CSS Tasks
*
* assets:stylesheets             : Compile/sort/lint/sourcemap/autoprefix/minify SCSS files to one CSS file.
* assets:stylesheets:format    : Sort SCSS files.
* assets:stylesheets:clean       : Remove any CSS files in stylesheet dist folder.
*/

gulp.task('assets:stylesheets', function () {
  return gulp.src([
      '!' + (root.src + css.src + css.main + '~'),
      root.src + css.src + css.main
    ])
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(gulpif(args.dev, sourcemaps.init()))
    .pipe(csscomb())
    .pipe(stylefmt())
    .pipe(stylelint({ reporters: [{ formatter: 'string', console: true }] }))
    .pipe(sass({ includePaths: css.include }))
    .pipe(autoprefix({ browsers: ['last 2 versions'] }))
    .pipe(cleancss())
    .pipe(rename('stylesheet.min.css'))
    .pipe(gulpif(args.dev, sourcemaps.write()))
    .pipe(gulp.dest(root.dest + css.dest))
    .pipe(gulpif(args.dev, livereload()))
})

gulp.task('assets:stylesheets:format', function () {
  return gulp.src([
      '!' + root.src + css.src + css.main,
      '!' + root.src + css.src + css.watch + '~',
      root.src + css.src + css.watch
    ])
   .pipe(plumber({ errorHandler: handleErrors }))
   .pipe(csscomb())
   .pipe(stylefmt())
   .pipe(stylelint({ reporters: [{ formatter: 'string', console: true }] }))
   .pipe(gulp.dest(root.src + css.src))
})

gulp.task('assets:stylesheets:clean', function () {
  return del([root.dest + css.dest])
})

/**
* JS Tasks
*
* assets:javascripts             : Compile/format/lint/sourcemap/concat/minify JS files to one JS file.
* assets:javascripts:format      : Format JS files.
* assets:javascripts:clean       : Remove any JS files in javascript dist folder.
*/
gulp.task('assets:javascripts', function () {
  return gulp.src([
      '!' + root.src + js.src + js.watch + '~',
      root.src + js.src + js.watch
    ])
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(gulpif(args.dev, sourcemaps.init()))
    .pipe(standardFormat())
    .pipe(standard())
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(concat('javascript.js'))
    .pipe(uglify())
    .pipe(rename('javascript.min.js'))
    .pipe(gulpif(args.dev, sourcemaps.write()))
    .pipe(gulp.dest(root.dest + js.dest))
    .pipe(gulpif(args.dev, livereload()))
})

gulp.task('assets:javascripts:format', function () {
  return gulp.src(root.src + js.src + js.watch)
   .pipe(plumber({ errorHandler: handleErrors }))
   .pipe(standardFormat())
   .pipe(standard())
   .pipe(gulp.dest(root.src + js.src))
})

gulp.task('assets:javascripts:clean', function () {
  return del([root.dest + js.dest])
})

/**
 * Global assets tasks
 *
 * assets:watch                   : Watch SCSS and JS files for changes and compile them.
 * assets:clean                   : Remove any files in CSS/JS dist folders.
 * assets:build                   : Clean/format/compile CSS/JS files.
 */

gulp.task('assets:watch', function () {
  gulp.watch([root.src + css.src + css.watch], ['assets:stylesheets'])
  gulp.watch([root.src + js.src + js.watch], ['assets:javascripts'])
})

gulp.task('assets:clean', [
  'assets:stylesheets:clean',
  'assets:javascripts:clean'
])

gulp.task('assets:build', [
  'assets:clean',
  'assets:stylesheets:format',
  'assets:stylesheets',
  'assets:javascripts:format',
  'assets:javascripts'
])

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

gulp.task('server:build', function () {
  var build = child.spawnSync('go', ['install'])

  // Log build errors
  if (build.stderr.length) {
    var lines = build.stderr
      .toString()
      .split('\n')
      .filter(function (line) {
        return line.length
      })

    for (var l in lines) {
      gutil.log(
        gutil.colors.red('Error (go install): ' + lines[l])
      )
    }

    notify.notify({
      title: 'Error (go install)',
      message: lines
    })
  }

  return build
})

gulp.task('server:spawn', function () {
  if (server) {
    server.kill()
  }

  server = child.spawn('go', ['run', 'breizhtrip.go', 'server', '-p', '5050'], { stdio: 'inherit' })

  livereload()
})

gulp.task('server:watch', function () {
  gulp.watch([views.src + views.watch], ['server:spawn'])
  gulp.watch(go.src, sync.sync([
    'server:build',
    'server:spawn'
  ]))
})

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
])

gulp.task('watch', ['build'], function () {
  livereload.listen()
  return gulp.start([
    'assets:watch',
    'server:watch',
    'server:spawn'
  ])
})
