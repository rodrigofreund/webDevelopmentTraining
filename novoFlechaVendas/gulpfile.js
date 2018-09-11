//Core do gulp
let gulp = require('gulp');

//Concatenar arquivos
var concat = require('gulp-concat');


//Usado junto com sourcemap
let autoprefixer = require('gulp-autoprefixer');
let sourcemaps = require('gulp-sourcemaps');

//Renomear arquivos
var rename = require("gulp-rename");

gulp.task('build-lib-js', function () {
  gulp.src([
    './js/**'
  ])
    .pipe(gulp.dest('./dist/js/lib'));
});

gulp.task('build-app-js', function () {
  gulp.src([
    './modules/**/*.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/modules'));
});

gulp.task('compress', function (cb) {
  pump([
        gulp.src('./dist/modules/*.js'),
        uglify(),
        gulp.dest('dist')
    ],
    cb
  );
});

gulp.task('dev-context', function () {
  gulp.src('js/context/dev-context.js')
    .pipe(rename("js/context.js"))
    .pipe(gulp.dest('dist'))
});

gulp.task('mobile-context', function () {
  gulp.src('js/context/mobile-context.js')
    .pipe(rename("js/context.js"))
    .pipe(gulp.dest('dist'))
});

gulp.task('prod-context', function () {
  gulp.src('js/context/prod-context.js')
    .pipe(rename("js/context.js"))
    .pipe(gulp.dest('dist'))
});

gulp.task('test-context', function () {
  gulp.src('js/context/test-context.js')
    .pipe(rename("js/context.js"))
    .pipe(gulp.dest('dist'))
});

gulp.task('css', function () {
  gulp.src('styles/*.css')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build'))
});

gulp.task('watch', function() {
  gulp.watch('modules/**/*.js', ['jshint']);
});

gulp.task('dev', ['build-lib-js', 'dev-context']);
gulp.task('prod', ['build-lib-js', 'prod-context']);
gulp.task('test', ['build-lib-js', 'test-context']);

/*
gulp.task('watch', function () {
  gulp.watch('styles/*.css', ['css']);
  gulp.watch('js/*.js', ['build']);

})
*/
