/* eslint-disable quotes, no-undef */

var gulp     = require('gulp'),
  autoprefix = require('gulp-autoprefixer'),
  livereload = require('gulp-livereload'),
  sourcemaps = require('gulp-sourcemaps'),
  prettify   = require('gulp-jsbeautifier'),
  cleancss   = require('gulp-clean-css'),
  scsslint   = require('gulp-scss-lint'),
  csscomb    = require('gulp-csscomb'),
  plumber    = require('gulp-plumber'),
  eslint     = require('gulp-eslint'),
  notify     = require('gulp-notify'),
  concat     = require('gulp-concat'),
  rename     = require('gulp-rename'),
  uglify     = require('gulp-uglify'),
  gutil      = require('gulp-util'),
  babel      = require('gulp-babel'),
  child      = require('child_process'),
  sync       = require('gulp-sync')(gulp),
  sass       = require('gulp-sass');

/* ----------------------------------------------------------------------------
 * locals
 * ------------------------------------------------------------------------- */

var server = null,
  assetSrc = 'assets/',
  assetDist = 'public/assets/',
  stylesheetsSrc = assetSrc + 'stylesheets/**/*',
  stylesheetsDist = assetDist + 'stylesheets',
  javascriptsSrc = assetSrc + 'javascripts/**/*',
  javascriptsDist = assetDist + 'javascripts',
  viewSrc = 'views/**/*.tmpl';

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

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

gulp.task('assets:stylesheets:sort', function() {
  return gulp.src(assetSrc + 'stylesheets/**/*')
   .pipe(plumber({ errorHandler: handleErrors }))
   .pipe(csscomb())
   .pipe(gulp.dest('./assets/stylesheets/'));
});

gulp.task('assets:stylesheets', function() {
  return gulp.src(assetSrc + 'stylesheets/main.scss')
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(sourcemaps.init())
    .pipe(csscomb())
    .pipe(scsslint())
    .pipe(sass({ includePaths: ['./node_modules/bulma'] }))
    .pipe(autoprefix({ browsers: ['last 2 versions'] }))
    .pipe(cleancss())
    .pipe(rename('stylesheet.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(stylesheetsDist))
    .pipe(livereload());
});

gulp.task('assets:javascripts', function() {
  return gulp.src(javascriptsSrc)
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(sourcemaps.init())
    .pipe(prettify())
    .pipe(eslint())
    .pipe(babel())
    .pipe(concat('javascript.js'))
    .pipe(uglify())
    .pipe(rename('javascript.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(javascriptsDist))
    .pipe(livereload());
});

gulp.task('assets:build', [
  'assets:stylesheets:sort',
  'assets:stylesheets',
  'assets:javascripts',
]);

gulp.task('assets:watch', function() {
  gulp.watch([stylesheetsSrc], ['assets:stylesheets']);
  gulp.watch([javascriptsSrc], ['assets:javascripts']);
});

/* ----------------------------------------------------------------------------
 * Server
 * ------------------------------------------------------------------------- */

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
  gulp.watch([viewSrc], ['server:spawn']);
  gulp.watch('*/**/*.go', sync.sync([
    'server:build',
    'server:spawn'
  ]));
});

/* ----------------------------------------------------------------------------
 * Interface
 * ------------------------------------------------------------------------- */

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
