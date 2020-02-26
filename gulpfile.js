var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var jsonminify = require('gulp-jsonminify');
var streamqueue = require('streamqueue');
var sourcemaps = require('gulp-sourcemaps');
var wrap = require("gulp-wrap");
var gzip = require("gulp-gzip");

gulp.task('default', ['deploy-css', 'deploy-js']);

gulp.task('deploy-js', function () {
    gulp.src([
        'bower_components/tooltipster/dist/js/tooltipster.bundle.js',
        'bower_components/ng-file-upload/ng-file-upload.js',
        'bower_components/randexp/build/randexp.min.js',
        'src/js/jurlp.js',
        'src/js/image-zoom.js',
        'src/js/jquery.daterangepicker.js',
        'src/js/utils.js',
        'src/js/cookies.js',
        'src/js/auth.js',
        'src/js/chip.js',
        'src/js/autocomplete.js',
        'src/js/date.js',
        'src/js/filters.js',
        'src/js/fullscreen.js',
        'src/js/clipboard.js',
        'src/js/i18n.js',
        'src/js/image.js',
        'src/js/image-crop.js',
        'src/js/loader.js',
        'src/js/search.js',
        'src/js/selector.js',
        'src/js/tooltipster.js',
        'src/js/validation-match.js',
        'src/js/barcode.js',
        'src/js/diff.js',
        'src/js/map.js',
        'src/js/leaflet-mouseposition.js',
        'src/js/leaflet-fullscreen.js',
        'src/js/google-maps-functions.js',
        'src/js/sentry.js',
        'src/js/main.js'
    ])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('ser-ui.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'))
    .pipe(gzip({ append: false }))
    .pipe(gulp.dest('gzip/js'));
});

gulp.task('deploy-css', function () {
    gulp.src('src/scss/*.scss').pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat({path: 'ser-ui.css', cwd: ''}))
    .pipe(gulp.dest('dist/css'))
    .pipe(minifyCss())
    .pipe(rename({
        extname: '.min.css'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(gzip({ append: false }))
    .pipe(gulp.dest('gzip/css'));

    gulp.src('src/css/ser-ui-fonts.css').pipe(sass().on('error', sass.logError))
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/css'))
    .pipe(gzip({ append: false }))
    .pipe(gulp.dest('gzip/css'));
});