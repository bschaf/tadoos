var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  concat = require('gulp-concat'),
  nib = require('nib'),
  normalize = require('normalize');

gulp.task('stylus', function () {
  gulp.src('./src/styles/*.styl')
  .pipe(stylus({
    use: [nib(), normalize()],
    compress: true
  }))
  .pipe(concat('app.css'))
  .pipe(gulp.dest('./public/styles'))
});

gulp.task('watch', function () {
  gulp.watch(['./src/styles/*.styl'], ['stylus']);
});

gulp.task('default', ['watch']);
