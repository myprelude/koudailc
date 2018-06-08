var gulp = require('gulp'),
  sass = require('gulp-sass'),
  nodemon = require('gulp-nodemon'),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload');


gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee ejs',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('sass', function () {
	return gulp.src('./public/sass/**/*.scss')
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(gulp.dest('./public/css'));
});

gulp.task('babel', () => {
    return gulp.src('./public/es6/**/*.js')
        .pipe(babel({
            presets: ['es2015']
		}))
		.pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('watch',function(){
	gulp.watch('./public/sass/**/*.scss',['sass']);
	gulp.watch('./public/es6/**/*.js',['babel']);
})
gulp.task('default', [
  'watch','develop'
]);
