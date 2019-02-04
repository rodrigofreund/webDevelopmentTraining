//Core do gulp
let gulp = require('gulp');


//Renomear arquivos
var rename = require("gulp-rename");

const htmlmin = require('gulp-htmlmin');

gulp.task('minify-css', function(){
  gulp.src(['./css/**'])
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('minify-modules-js', function(){
  gulp.src(['./modules/**/*.js'])
    .pipe(gulp.dest('./dist/modules'));
});

gulp.task('minify-modules-html', function(){
  gulp.src(['./modules/**/*.html'])
    .pipe(gulp.dest('./dist/modules'));
});

gulp.task('minify-js', function(){
  gulp.src(['./js/*.js'])
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('minify-images', function(){
  gulp.src(['./images/*'])
    .pipe(gulp.dest('./dist/images'));
});

gulp.task('minify-img', function(){
  gulp.src(['./img/*'])
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('minify-html', function(){
  gulp.src(['index.html'])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-ico', function(){
  gulp.src(['favicon.ico'])
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-fonts', function(){
  gulp.src(['fonts/*'])
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('ndev', ['minify-css', 'minify-modules-js', 'minify-modules-html', 'minify-js', 'minify-images', 'minify-img', 'minify-html', 'minify-ico', 'minify-fonts', 'dev-context']);

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
