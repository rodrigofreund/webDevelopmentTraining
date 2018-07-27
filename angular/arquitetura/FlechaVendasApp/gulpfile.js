var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var version = require('gulp-version-number');
var autopolyfiller = require('gulp-autopolyfiller');

const versionConfig = {
  'value': '%MDS%',
  'append': {
    'key': 'v',
    'to': ['css', 'js'],
  },
};

gulp.task('js', function(){
  gulp.src('modules/**/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('dist/'));
});

gulp.task('html', function(){
  gulp.src('*.html')
  .pipe(version(versionConfig))
  .pipe(gulp.dest('dist/'));
});

gulp.task('autopolyfiller', function () {
  return gulp.src('modules/**/*.js')
      .pipe(autopolyfiller('main.js'))
      .pipe(gulp.dest('dist/'));
});


gulp.task('default',['js', 'autopolyfiller', 'html'],function(){
});