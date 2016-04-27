var gulp = require('gulp')
var bower = require('main-bower-files')
var livereload = require('gulp-livereload');
var gulpLoadPlugins = require('gulp-load-plugins');
var p = gulpLoadPlugins();
var lib    = require('bower-files')();
var cssmin = require('gulp-cssmin');
var ngAnnotate = require('gulp-ng-annotate');
var ngTemplates = require('gulp-ng-templates');

var src = {
  all: './web/**/*',
  html: './web/**/*.html',
  images: './web/assets/images/*.svg',
  js: './web/javascripts/**/*.js',
  template: './web/javascripts/**/*.html',
  scss: 'web/stylesheets/**/*.scss',
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

gulp.task('clean', () => { gulp.src(src.dist + '/*').pipe(p.clean())});

gulp.task('build',  () => {

  gulp.src(src.template)
		.pipe(ngTemplates({
      filename: 'templates.min.js',
      module: 'pockApp',
      standalone: false,
      path: (path, base) => {
        return path.replace(base,'javascripts/');
      }
    }))
		.pipe(gulp.dest(src.dist));

  gulp.src(src.js)
    .pipe(p.concat('main.js'))
    .pipe(ngAnnotate())
    .pipe(p.babel())
    .pipe(p.uglify())
    .pipe(gulp.dest(src.dist))

  gulp.src(src.scss)
   .pipe(p.sass({outputStyle: 'compressed'}))
   .pipe(gulp.dest(src.dist));

  gulp.src(lib.ext('js').files)
    .pipe(p.concat('vendor.js'))
    // .pipe(ngAnnotate())
    // .pipe(p.uglify())
    .pipe(gulp.dest(src.dist))

  gulp.src(lib.ext('css').files)
    .pipe(cssmin())
    .pipe(p.concat('vendor.css'))
    .pipe(gulp.dest(src.dist))

  gulp.src(src.images, src.base)
    .pipe(gulp.dest(src.dist))
});
