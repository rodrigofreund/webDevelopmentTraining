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
    './js/**'
  ])
  .pipe(gulp.dest('./dist/js/lib'));
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

