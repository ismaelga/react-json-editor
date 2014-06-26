'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var deploy = require('gulp-gh-pages');


gulp.task('default', ['compile']);

gulp.task('deploy', ['compile'], function () {
    gulp.src(['dist/**/*']).pipe(deploy());
});

gulp.task('compile', ['css', 'html', 'scripts']);

gulp.task('css', function() {
    return gulp.src('example/*.css').pipe(gulp.dest('dist/css'));
});

gulp.task('html', function() {
    return gulp.src('example/*.html').pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
    gulp.src('example/*.js').
        pipe(browserify({
            insertGlobals : true,
            debug : !process.env.production
        })).
        pipe(gulp.dest('dist/src'));
});
