var plugins    = require('gulp-load-plugins');
var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var concat     = require('gulp-concat');

// Load all Gulp plugins into one variable
const $ = plugins();

// Build the site, and watch for file changes
gulp.task('default', gulp.series(
  gulp.parallel(compileReact, sass), watch));

// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
  return gulp.src('src/scss/app.scss')
    .pipe($.sass()
      .on('error', $.sass.logError))
    .pipe($.cssnano())
    .pipe(gulp.dest('dist/css'));
}

// Compile react in coffeescript into javascript
function compileReact() {
  return gulp.src('./src/react/index.coffee', { read: false })
    .pipe(browserify({ transform: ['coffeeify'], extensions: ['.coffee'] }))
    .pipe(concat('app2.js'))
    .pipe($.uglify().on('error', function(e) { console.log(e); }))
    .pipe(gulp.dest('dist/js'));
}

// Watch for changes to static assets, pages, Sass, JavaScript, and CoffeeScript
function watch() {
  gulp.watch('src/react/**/*.coffee').on('all', gulp.series(compileReact));
  gulp.watch('src/scss/**/*.scss').on('all', gulp.series(sass));
}
