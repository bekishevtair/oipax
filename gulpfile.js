const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const htmlmin = require('gulp-htmlmin');
const jsmin = require('gulp-minify');
const cssmin = require('gulp-clean-css');
const rename = require("gulp-rename");
const browserSync = require('browser-sync').create()

function style () {
  return gulp.src('src/assets/styles/int/scss/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('src/assets/styles/int/css'))
  .pipe(browserSync.stream())
  .pipe(cssmin())
  .pipe(rename({ extname: '.min.css' }))
  .pipe(gulp.dest('src/assets/styles/int/css'))
}
function script () {
  return gulp.src('src/assets/scripts/int/script.js')
  .pipe(jsmin({ 
    ext: { min: '.min.js' },
    noSource: true
  }))
  .pipe(gulp.dest('src/assets/scripts/int'))
  .pipe(browserSync.stream())
}
function watch () {
  browserSync.init({
      server: {
         baseDir: "./src",
         index: "/index.html"
      }
  })
  gulp.watch('src/**/*.html').on('change', browserSync.reload)
  gulp.watch('src/assets/scripts/int/script.js', script)
  gulp.watch('src/assets/styles/int/scss/**/*.scss', style)
}
exports.style = style
exports.watch = watch