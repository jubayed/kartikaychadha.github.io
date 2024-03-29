var gulp = require('gulp');
var sass = require('gulp-sass');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cp = require('child_process');
var flatten = require('gulp-flatten');
var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var source = require('vinyl-source-stream');
var concatjs = require('gulp-concat');
var browserSync = require('browser-sync').create();

var paths = {
  styles: {
    src: '_sass/*.scss',
    dest: '_site/assets/css',
    destsecond: 'css'
  },
  scripts: {
    src: '_js/src/*.js',
    dest: '_site/assets/js/',
    destsecond: 'js/dist/'
  }
};

function jekyllBuild() {
  return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
}

function style() {
  return gulp.src(paths.styles.src)
    .pipe(sass({
      includePaths: ['scss'],
      outputStyle: 'expanded',
      onError: browserSync.notify
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest(paths.styles.destsecond));
}

function js() {
  return gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    paths.scripts.src
  ])
  .pipe(concatjs('app.bundle.js'))
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(browserSync.reload({stream:true}))
}

function browserSyncServe(done) {
  browserSync.init({
    server: {
      baseDir: "_site"
    }
  })
  done();
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function watch() {
  gulp.watch(paths.styles.src, style)
//   gulp.watch(paths.scripts.src, js)
  gulp.watch(
    [
    '*.html',
    '*.md',
    '_layouts/*.html',
    '_pages/*',
    '_posts/*',
    // '_data/*',
    '_csv/*',
    '_includes/*',
    '_plugins/*.rb',
    '_plugins/*/*.rb',
    'assets/*/*',
    'assets/*',
  ],
  gulp.series(jekyllBuild, browserSyncReload));
}

gulp.task('default', gulp.parallel(jekyllBuild, browserSyncServe, watch))