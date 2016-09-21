var gulp     = require('gulp'),
  autoprefix = require('gulp-autoprefixer'),
  livereload = require('gulp-livereload'),
  sourcemaps = require('gulp-sourcemaps'),
  plumber    = require('gulp-plumber'),
  cssnano    = require('gulp-cssnano'),
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
    title: 'Error: <%= error.message %>'
  }).apply(this, args);
  gutil.beep();
  this.emit('end');
}

gulp.task('sass', function() {
  return gulp.src('./assets/stylesheets/main.scss')
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(sourcemaps.init())
    .pipe(sass({
       errLogToConsole: true,
       outputStyle: 'expanded',
       includePaths: ['./assets/stylesheets']
     }))
    .pipe(autoprefix({
      browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
    }))
    .pipe(cssnano({
        safe: true // Use safe optimizations.
     }))
    .pipe(sourcemaps.write("."))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('public/assets/stylesheets/'))
    .pipe(livereload());
});

gulp.task('js', function() {
  return gulp.src('assets/javascripts/**/*')
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('javascript.js'))
    // .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(rename('javascript.min.js'))
    .pipe(gulp.dest('public/assets/javascripts/'))
});

// create a default task and just log a message
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('assets/sass/**/*', ['sass']);
  gulp.watch('assets/javascripts/**/*', ['js']);
  gutil.log('Watching all .scss and js files...');
});
