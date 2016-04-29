var gulp = require('gulp'),
    del = require('gulp-clean'),
    sass = require('gulp-sass'),
    bower = require('main-bower-files'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    livereload = require('gulp-livereload'),
    run = require('run-sequence'),
    gif = require('gulp-if'),
    ngTemplate = require('gulp-ng-templates'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    htmlreplace = require('gulp-html-replace');

var build = false;

var isBuild = () => { return build }

var src = {
  css: './web/style/**/*.scss',
  js: './web/script/**/*.js',
  templates: './web/script/**/*.html',
  img: './web/images/**/*',
  root: './web/*.*'
}

var dist = {
  js: './public/script',
  css: './public/style',
  images: './public/images',
  root: './public/'
}

gulp.task('clean', () => {
  return gulp.src(dist.root, {read: false})
    .pipe(del())
})

gulp.task('style', () => {
  gulp.src(src.css)
    .pipe(sass())
    .pipe(gif(isBuild, cssnano()))
    .pipe(gif(isBuild, rename('main.min.css')))
    .pipe(gulp.dest(dist.css))

  gulp.src(bower('**/*.css'))
    .pipe(concat('vendor.css'))
    .pipe(gif(isBuild, cssnano()))
    .pipe(gif(isBuild, rename('vendor.min.css')))
    .pipe(gulp.dest(dist.css))
})

gulp.task('js', () => {
  gulp.src(src.js)
    .pipe(babel())
    .pipe(gif(isBuild, concat('main.min.js')))
    .pipe(gulp.dest(dist.js))

  gulp.src(src.templates)
    .pipe(gif(isBuild, ngTemplate({
      filename: 'templates.min.js',
      module: 'pockApp',
      standalone: false,
      path: (path, base) => {
        return path.replace(base, 'script/');
      }
    })))
    .pipe(gulp.dest(dist.js))

  gulp.src(bower('**/*.js'))
    .pipe(gif(isBuild, concat('vendor.min.js')))
    .pipe(gulp.dest(dist.js))
})

gulp.task('images', () => {
  gulp.src(src.img)
    .pipe(gulp.dest(dist.images))
})

gulp.task('root', () => {
  gulp.src(src.root)
    .pipe(gif(isBuild,htmlreplace({
      js: ['script/vendor.min.js', 'script/main.min.js', 'script/templates.min.js'],
      css: ['style/vendor.min.css', 'style/main.min.css']
    })))
    .pipe(gulp.dest(dist.root))
})

gulp.task('watch', ['style', 'js', 'images', 'root'], () => {
  livereload.listen();
  gulp.watch(src.js, ['js']).on('change', livereload.changed);
  gulp.watch(src.css, ['style']).on('change', livereload.changed);
  gulp.watch(src.img, ['images']).on('change', livereload.changed);
  gulp.watch(src.root, ['root']).on('change', livereload.changed);
})

gulp.task('default', ['clean'], () => {
  build = true;
  run(['style', 'js', 'images', 'root'])
})
