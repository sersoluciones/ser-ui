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

gulp.task('deploy', ['deploy-css', 'deploy-js', 'deploy-js-all']);

gulp.task('deploy-js-all', function () {
    gulp.src([
        'bower_components/moment/moment.js',
        'bower_components/jquery/dist/jquery.js',
        'bower_components/js-cookie/src/js.cookie.js',
        'bower_components/tooltipster/dist/js/tooltipster.bundle.js',
        'bower_components/file-saver/FileSaver.js',
        'src/js/third-party/blob.js',
        'src/js/third-party/fullcalendar.js',
        'src/js/third-party/jurlp.js',
        'src/js/third-party/image-zoom.js',
        'src/js/third-party/jquery.daterangepicker.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-animate/angular-animate.js',
        'bower_components/angular-aria/angular-aria.js',
        'bower_components/angular-filter/dist/angular-filter.js',
        'bower_components/angular-fullscreen/src/angular-fullscreen.js',
        'bower_components/angular-material/angular-material.js',
        'bower_components/angular-messages/angular-messages.js',
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'bower_components/angular-ui-router/release/angular-ui-router.js',
        'bower_components/ng-file-upload/ng-file-upload.js',
        'bower_components/angular-websocket/dist/angular-websocket.js',
        'bower_components/randexp/build/randexp.min.js',
        'bower_components/JsBarcode/dist/JsBarcode.all.js',
        'src/js/utils.js',
        'src/js/auth.js',
        'src/js/autocomplete.js',
        'src/js/date.js',
        'src/js/filters.js',
        'src/js/i18n.js',
        'src/js/image.js',
        'src/js/loader.js',
        'src/js/search.js',
        'src/js/selector.js',
        'src/js/tooltipster.js',
        'src/js/validation-match.js',
        'src/js/barcode.js',
        'src/js/main.js'
    ])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('ser-ui.all.js'))
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

gulp.task('deploy-js', function () {
    gulp.src([
        'bower_components/js-cookie/src/js.cookie.js',
        'bower_components/tooltipster/dist/js/tooltipster.bundle.js',
        'bower_components/file-saver/FileSaver.js',
        'src/js/third-party/blob.js',
        'src/js/third-party/jurlp.js',
        'src/js/third-party/image-zoom.js',
        'src/js/third-party/jquery.daterangepicker.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-animate/angular-animate.js',
        'bower_components/angular-aria/angular-aria.js',
        'bower_components/angular-filter/dist/angular-filter.js',
        'bower_components/angular-fullscreen/src/angular-fullscreen.js',
        'bower_components/angular-material/angular-material.js',
        'bower_components/angular-messages/angular-messages.js',
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'bower_components/angular-ui-router/release/angular-ui-router.js',
        'bower_components/ng-file-upload/ng-file-upload.js',
        'bower_components/angular-websocket/dist/angular-websocket.js',
        'bower_components/randexp/build/randexp.min.js',
        'src/js/utils.js',
        'src/js/auth.js',
        'src/js/autocomplete.js',
        'src/js/date.js',
        'src/js/filters.js',
        'src/js/i18n.js',
        'src/js/image.js',
        'src/js/loader.js',
        'src/js/search.js',
        'src/js/selector.js',
        'src/js/tooltipster.js',
        'src/js/validation-match.js',
        'src/js/barcode.js',
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
    streamqueue({ objectMode: true },
        gulp.src([
            'bower_components/angular-material/angular-material.css'
        ]),
        gulp.src('src/scss/*.scss').pipe(sass().on('error', sass.logError))
    )
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
});