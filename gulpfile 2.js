const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const notify = require('gulp-notify');
const reload = browserSync.reload;

gulp.task('styles', () => {
    return gulp.src('./src/styles/**/*.scss')
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./public/styles/'))
        .pipe(reload({ stream: true }));
});

gulp.task('js', () => {
    return browserify('./src/scripts/script.js', { debug: true })
        .transform('babelify', {
            sourceMaps: true,
            presets: ['@babel/preset-env']
        })
        .bundle()
        .on('error', notify.onError({
            message: "Error: <%= error.message %>",
            title: 'Error in JS 💀'
        }))
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./public/scripts'))
        .pipe(reload({ stream: true }));
});

gulp.task('bs', () => {
    return browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('watch', () => {
    gulp.watch('./src/**/*.js', ['js']);
    gulp.watch('./src/**/*.scss', ['styles']);
    gulp.watch('./public/styles/style.css', reload);
    gulp.watch('./index.html', reload);
});

gulp.task('default', ['styles', 'js', 'watch', 'bs']);
