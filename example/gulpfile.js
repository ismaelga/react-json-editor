'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify');


gulp.task('default', ['compile']);
gulp.task('compile', ['scripts']);
gulp.task('scripts', function() {
    gulp.src('./app.js').
        pipe(browserify({
            insertGlobals : true,
            debug : !process.env.production
        })).
        pipe(gulp.dest('./src'));
});
