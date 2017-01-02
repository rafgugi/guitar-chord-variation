'use strict';

var plugins    = require('gulp-load-plugins');
var yargs      = require('yargs');
var gulp       = require('gulp');
var coffee     = require('gulp-coffee');
var browserify = require('gulp-browserify');
var concat     = require('gulp-concat');

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Build the site, and watch for file changes
gulp.task('default', gulp.series(compileReact, watch));

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
}
