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
const srcset       = require('gulp-srcset')
const babel        = require('gulp-babel')
const browserify   = require('browserify')
const babelify     = require('babelify')
const source       = require('vinyl-source-stream')
const util         = require('gulp-util')
const browserSync  = require('browser-sync')
const gulpif       = require('gulp-if')


// $Server
gulp.task('liveserver', () => {
  browserSync.init({
    server: config.dist,
    port: config.port,
    open: 'local'
  });
});


// $Html
gulp.task('html', () =>
    gulp.src(config.src + '*.html')
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.stream())
        .pipe(notify('HTML updated: <%= file.relative %>'))
);


// $Sass
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


// $Javascript
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


// $Srcset
gulp.task('srcset', () => {
    gulp
        .src(config.src + 'img/src/*')
        .pipe(
            srcset([
                {
                    width: [1, 1920, 1280, 720, 560, 320],
                    format: ['jpg', 'png']
                }
            ])
        )
        .pipe(gulp.dest(config.src + 'img/src'));
});


// $Images
gulp.task('images', () =>
gulp.src(config.src + 'img/*.{jpg,jpeg,png,gif}')
    .pipe(imagemin())
    .pipe(gulp.dest(config.dist + 'assets/img'))
    .pipe(browserSync.stream())
    .pipe(notify('Images minified : <%= file.relative %> !'))
);


// $Videos
gulp.task('videos', () =>
gulp
  .src(config.src + 'video/**/*')
  .pipe(gulp.dest(config.dist + 'assets/video'))
  .pipe(browserSync.stream())
);


// $Fonts
gulp.task('fonts', () =>
    gulp.src(config.src + 'fonts/**/*')
        .pipe(gulp.dest(config.dist + 'assets/fonts'))
        .pipe(browserSync.stream())
        .pipe(notify('Fonts updated : <%= file.relative %> !'))
);


// $Src task
gulp.task(
    'srcset',
    gulp.series('srcset')
);


// $Build task
gulp.task(
    'build',
    gulp.series('html', 'sass','javascript', 'images', 'videos', 'fonts')
);


// $Dev task
gulp.task(
    'dev',
    gulp.parallel('liveserver', () => {
        gulp.watch(config.src + '**/*.html', gulp.parallel('html'));
        gulp.watch(config.src + 'scss/**/*.scss', gulp.parallel('sass'));
        gulp.watch(config.src + 'js/**/*.js', gulp.parallel('javascript'));
        gulp.watch(config.src + 'font/*', gulp.parallel('fonts'));
    })
);

