var browserSync = require('browser-sync');
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var plumber = require('gulp-plumber');

gulp.task('less', function () {
  gulp.src('./cuad-less/styles.less')
    .pipe(plumber())
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./cuad-app/public/css/')).pipe(gulp.dest('./cuad-app/public/css/'))
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "192.168.99.100:3000/"
    });
    gulp.watch("./cuad-less/*.less", ['less']).on('change', browserSync.reload);

    
});

gulp.task('default', [ 'browser-sync']);