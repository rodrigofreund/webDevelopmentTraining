//Core do gulp
let gulp = require('gulp');

//Mimificar arquivos
let uglify = require('gulp-uglify');

//Concatenar arquivos
var concat = require('gulp-concat');

//Usado junto com sourcemap
let autoprefixer = require('gulp-autoprefixer');
let sourcemaps = require('gulp-sourcemaps');

//Renomear arquivos
var rename = require("gulp-rename");

gulp.task('build-js', function() {
  gulp.src([
    './js/jquery-3.1.0.min.js',
    './js/jquery-ui.min.js',
    './js/angular.min.js',
    './js/angular-locale_pt-br.js',
    './js/angular-route.min.js',
    './js/angular-ui-router.min.js',
    './js/angular-cookies.min.js',
    './js/angular-block-ui.min.js',
    './js/angular-sanitize.min.js',
    './js/angular-animate.min.js',
    './js/angular-ui-notification.min.js',
    './js/ui-grid.min.js',
    './js/mask.min.js',
    './js/select.min.js',
    './js/moment.min.js',
    './js/moment-with-locales.min.js',
    './js/bootstrap.min.js',
    './js/bootstrap-datepicker.min.js',
    './locales/bootstrap-datepicker.pt-BR.min.js',
    './js/ui-bootstrap-tpls-2.4.0.min.js',
    './js/image-compressor.min.js'
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('lib.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./dist/js'));
});

gulp.task('dev-context', function() {
  gulp.src('js/context/dev-context.js')
  .pipe(rename("js/context.js"))
  .pipe(gulp.dest('dist'))
});

gulp.task('mobile-context', function() {
  gulp.src('js/context/mobile-context.js')
  .pipe(rename("js/context.js"))
  .pipe(gulp.dest('dist'))
});

gulp.task('prod-context', function() {
  gulp.src('js/context/prod-context.js')
  .pipe(rename("js/context.js"))
  .pipe(gulp.dest('dist'))
});

gulp.task('test-context', function() {
  gulp.src('js/context/test-context.js')
  .pipe(rename("js/context.js"))
  .pipe(gulp.dest('dist'))
});

gulp.task('css', function() {
  gulp.src('styles/*.css')
  .pipe(sourcemaps.init())
  .pipe(autoprefixer())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('build'))
});

gulp.task('dev', ['build-js', 'dev-context']);
gulp.task('prod', ['build-js', 'prod-context']);
gulp.task('test', ['build-js', 'test-context']);

gulp.task('watch', function() {
  gulp.watch('styles/*.css', ['css']);
  gulp.watch('js/*.js', ['build']);

})

