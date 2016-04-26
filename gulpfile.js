var gulp = require('gulp')
var sass = require('gulp-ruby-sass')
var bower = require('main-bower-files')
var livereload = require('gulp-livereload');


var src = {
  all: './web/**/*',
  html: './web/**/*.html',
  images: './web/assets/images/*.svg',
  js: './web/javascripts/**/*.js',
  scss: 'web/**/*.scss',
  dist: './public',
  base: {base: './web'}
}

var log = (err) => {
  console.log('bosta');
  console.log(err)
}

gulp.task('sass', () => {
  return sass(src.scss, {style: 'expanded'})
    .on('error', log)
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


// gulp.task('vendor', function() {
//   gulp.src('dist/lib/**/*.js')
//   .pipe(vendor('vendor.js'))
//   .pipe(rename({extname:".min.js"}))
//   .pipe(gulp.dest('dist/'));
// });

// gulp.task('bower', function(){
//     bower()
//       .pipe(gulp.dest('dist/lib'));
// });

// gulp.task('clean', function(){
//   gulp.src(['dist'])
//     .pipe(clean());
// });

// gulp.task('template', function(){

//   gulp.src(src.html)
//     .pipe(template())
//     .pipe(gulp.dest(src.template));
// });

// gulp.task('js', ['clean', 'template'], function(){
//   gulp.src(src.js)
//     .pipe(ngmin())
//     .pipe(concat('pock.js'))
//     .pipe(gulp.dest(src.dist))
//     .pipe(uglify())
//     .pipe(rename({extname:".min.js"}))
//     .pipe(gulp.dest(src.dist))
// });

// gulp.task('default', function(){
//   gulp.start('js');
// });
