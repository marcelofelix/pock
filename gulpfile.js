var gulp = require('gulp')
var sass = require('gulp-ruby-sass')
var bower = require('main-bower-files')
var livereload = require('gulp-livereload');
var babel = require("gulp-babel");
var clean = require('gulp-clean');


var src = {
  all: './web/**/*',
  html: './web/**/*.html',
  images: './web/assets/images/*.svg',
  js: './web/javascripts/**/*.js',
  scss: 'web/**/*.scss',
  dist: './public',
  base: {base: './web'}
}


gulp.task('sass', () => {
  return sass(src.scss, {style: 'expanded'})
    .pipe(gulp.dest(src.dist))
    .pipe(livereload())
});

gulp.task('images', () => {
  return gulp.src(src.images, src.base)
    .pipe(gulp.dest(src.dist))
    .pipe(livereload())
});

gulp.task('js', () => {
  return gulp.src(src.js, src.base)
    .pipe(gulp.dest(src.dist))
    .pipe(babel())
    .pipe(livereload())
})

gulp.task('html', () => {
  return gulp.src(src.html, src.base)
    .pipe(gulp.dest(src.dist))
    .pipe(livereload())
})

gulp.task('bower', () => {
  return gulp.src(bower())
    .pipe(gulp.dest(src.dist + '/vendor'))
    .pipe(livereload())
})

gulp.task('dev', ['sass', 'js', 'html', 'images', 'bower'], () => {
  livereload.listen();
  gulp.watch(src.all,['sass', 'js', 'html', 'images', 'bower'])
})

gulp.task('build', () => {
  gulp.src(src.dist)
    .pipe(clean());
});
