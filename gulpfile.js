/* eslint-disable quotes */

var gulp     = require('gulp'),
  autoprefix = require('gulp-autoprefixer'),
  livereload = require('gulp-livereload'),
  sourcemaps = require('gulp-sourcemaps'),
  remember   = require('gulp-remember'),
  plumber    = require('gulp-plumber'),
  cssnano    = require('gulp-cssnano'),
  cached     = require('gulp-cached'),
  notify     = require('gulp-notify'),
  concat     = require('gulp-concat'),
  rename     = require('gulp-rename'),
  uglify     = require('gulp-uglify'),
  gutil      = require('gulp-util'),
  babel      = require('gulp-babel'),
  sass       = require('gulp-sass');

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: '<%= error.plugin %> failed',
    message: '<%= error.message %>'
  }).apply(this, args);
  gutil.beep();
  this.emit('end');
}

gulp.task('sass', function() {
  return gulp.src('assets/stylesheets/main.scss')
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(sourcemaps.init())
    .pipe(cached('sass'))
    .pipe(sass({ includePaths: ['./node_modules/bulma'] }))
    .pipe(autoprefix({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(cssnano())
    .pipe(remember('sass'))
    .pipe(sourcemaps.write('.'))
    .pipe(rename('stylesheet.min.css'))
    .pipe(gulp.dest('public/assets/stylesheets/'))
    .pipe(livereload());
});

gulp.task('js', function() {
  return gulp.src('assets/javascripts/**/*')
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(sourcemaps.init())
    .pipe(cached('js'))
    .pipe(babel())
    .pipe(remember('scripts'))
    .pipe(concat('javascript.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(rename('javascript.min.js'))
    .pipe(gulp.dest('public/assets/javascripts/'));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('assets/stylesheets/**/*', ['sass']);
  gulp.watch('assets/javascripts/**/*', ['js']);
  gutil.log('Watching all .scss and js files...');
});

gulp.task('default', ['sass', 'js']);

/* eslint-enable quotes */
