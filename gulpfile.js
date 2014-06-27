'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');


gulp.task('default', ['compile']);

gulp.task('compile', ['css', 'html', 'scripts']);

gulp.task('css', function() {
    return gulp.src('example/*.css').pipe(gulp.dest('dist/css'));
});

gulp.task('html', function() {
    return gulp.src('example/*.html').pipe(gulp.dest('dist'));
});

// see http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
// for further instructions (watchify etc.)
gulp.task('scripts', function() {
    var bundler = browserify('./example/app.jsx');

    bundler.transform(reactify);

    var rebundle = function() {
        var stream = bundler.bundle({
            insertGlobals: true,
            debug: !process.env.production
        });
        stream.on('error', function(err) {
            console.log('Browserify error : ' + err);
        });
        stream = stream.pipe(source('app.js'));

        return stream.pipe(gulp.dest('dist/src'));
    }

    bundler.on('update', rebundle);

    return rebundle();
});
