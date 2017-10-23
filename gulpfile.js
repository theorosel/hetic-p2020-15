const config = {
    root : 'dist/',
    src  : 'src/',
    dist : 'dist/',
    port : 8080,
    env  : process.env.NODE_ENV === 'production'
}


const gulp         = require('gulp')
const notify       = require('gulp-notify')
const plumber      = require('gulp-plumber')
const sass         = require('gulp-sass')
const minify       = require('gulp-minify')
const sourcemaps   = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const rename       = require('gulp-rename')
const imagemin     = require('gulp-imagemin')
const babel        = require('gulp-babel')
const browserify   = require('browserify')
const babelify     = require('babelify')
const source       = require('vinyl-source-stream')
const util         = require('gulp-util')
const browserSync  = require('browser-sync')
const gulpif       = require('gulp-if')


// Server
gulp.task('liveserver', () => {
  browserSync.init({
    server: config.dist,
    port: config.port,
    open: 'local'
  });
});


// HTML
gulp.task('html', () =>
    gulp.src(config.src + '*.html')
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.stream())
        .pipe(notify('HTML updated: <%= file.relative %>'))
);


// Sass
gulp.task('sass', () =>
    gulp.src(config.src + 'scss/*.scss')
        .pipe(plumber({errorHandler: notify.onError('Error : <%= error.message %>')}))
        .pipe(gulpif(!config.env, sourcemaps.init()))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(!config.env, sourcemaps.write()))
        .pipe(rename(function (path) {
            path.basename += '.min'
        }))
        .pipe(gulp.dest(config.dist + 'assets/css'))
        .pipe(browserSync.stream())
        .pipe(notify('Saas compiled : <%= file.relative %> !'))
);


// Javascript
gulp.task('javascript', () =>
    browserify({
        entries: config.src + 'js/app.js',
        debug: true
    })
    .transform(babelify, { presets: ['es2015'] })
    .on('error', util.log)
    .bundle()
    .on('error', util.log)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(config.dist + 'assets/js'))
    .pipe(browserSync.stream())
    .pipe(notify('Js compiled : <%= file.relative %> !'))
);


// Images
gulp.task('images', () =>
    gulp.src(config.src + 'img/*')
        .pipe(imagemin())
        .pipe(gulp.dest(config.dist + 'assets/img'))
        .pipe(browserSync.stream())
        .pipe(notify('Images minified : <%= file.relative %> !'))
);


// Fonts
gulp.task('fonts', () =>
    gulp.src(config.src + 'font/**/*')
        .pipe(gulp.dest(config.dist + 'assets/font'))
        .pipe(browserSync.stream())
        .pipe(notify('Fonts updated : <%= file.relative %> !'))
);


// vendors
gulp.task('vendors', () =>
    gulp.src(config.src + 'js/vendors/**/*')
        .pipe(gulp.dest(config.dist + 'assets/js/vendors'))
        .pipe(browserSync.stream())
        .pipe(notify('Vendors updated : <%= file.relative %> !'))
);


// Watch
gulp.task('watch', () => {
    gulp.watch([config.src + 'js/*.js'], ['javascript']);
    gulp.watch([config.src + 'scss/**/*.scss'], ['sass']);
    gulp.watch([config.src + '*.html'], ['html']);
    gulp.watch([config.src + 'img/*'], ['images']);
    gulp.watch([config.src + 'font/*'], ['fonts']);
    gulp.watch([config.src + 'js/vendors/*'], ['vendors']);
});


// Build
gulp.task('build', ['html', 'sass', 'javascript', 'images', 'fonts', 'vendors'], () => {});

// Dev
gulp.task('dev', ['html', 'sass', 'javascript', 'liveserver', 'watch'], () => {});
