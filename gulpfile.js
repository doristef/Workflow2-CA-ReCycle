const gulp = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const minify = require('gulp-minify');
const jpegtran = require('imagemin-jpegtran');
const mozjpeg = require('imagemin-mozjpeg');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
 
 
// Task to compile sass
gulp.task('sass', function () {
    gulp.src('_sass/stylesheet.scss')
        .pipe(sass({outputStyle: 'compressed'}, { includePaths: ['scss'] }).on('error', sass.logError))
        .pipe(gulp.dest('dist/_css'));
});

// Task to minify images
gulp.task('minify-img', function () {
    gulp.src('_img/*.{gif,jpg,jpeg,png,svg}')
        .pipe(imagemin([
            jpegtran({progressive: true}),
            mozjpeg({quality: '75'}), // set the quality percentage (out of 100)
            imagemin.optipng({optimizationLevel: 4})
        ]))
        .pipe(gulp.dest('./dist/_img'))
});

// Task to sync broweser and watch files
gulp.task('sync', function () {
    browserSync.init({
        server: {
            baseDir: './dist/'
        }
    }); 
    // Watch all sass files, minify css.
    gulp.watch('_sass/*.scss', ['sass']).on('change', reload);
    // Minify images and reload browser on change.
    gulp.watch('_img/*.{png,jpg,jpeg,gif,svg}', ['minify-img']).on('change', reload);
    // Watch all html and css files and reload browser
    gulp.watch('./dist/*.html').on('change', reload);
    gulp.watch('./dist/_css/*.css').on('change', reload);
});
 
// Default gulp Task
gulp.task('default', ['sass', 'minify-img', 'sync']);