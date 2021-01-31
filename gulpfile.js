/*
 src 参照元を指定
 dest 出力先を指定git commit -m "first commit" 
 watch ファイル監視
 series (直列処理) と parallel (並列処理)
*/
const { src, dest, watch, series ,parallel} = require('gulp');

// プラグイン呼び出し
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const cleancss = require('gulp-clean-css');
const browsersync = require('browser-sync').create();
const imageResize = require('gulp-image-resize');
const imageMin = require('gulp-imagemin');


// プラグイン処理

// icon Task
function icon() {
    return src('./src/image/favicon/favicon.png')
    .pipe(imageResize({
        width:100,
        height: 100,
        crop: true,
        upscale: false
    }))
    .pipe(rename({prefix: 're-'}))
    .pipe(dest('./dist/image/favicon/'));
}

// copyFiles Task
function copyFiles() {
    return src('*.html')
    .pipe(rename({prefix: 'hello-'}))
    .pipe(dest('./dist'));
}

// Sass Task
function scssTask(){
    return src('./src/sass/style.scss', { sourcemaps: true })
      .pipe(sass())
      .pipe(postcss([cssnano()]))
      .pipe(dest('./dist/css', { sourcemaps: '.' }));
  }

// MinCss Task
function minCssTask(){
    return src('./dist/css/style.css', { sourcemaps: true })
      .pipe(cleancss())
      .pipe(rename({prefix: 'min-'}))
      .pipe(dest('./dist/css', { sourcemaps: '.' }));
  }

  // MinImage Task
function minImageTask(){
    return src('./src/image/*', { sourcemaps: true })
      .pipe(imageMin())
      .pipe(rename({prefix: 'min-'}))
      .pipe(dest('./dist/image/', { sourcemaps: '.' }));
  }

  // JavaScript Task
function jsTask(){
    return src('./src/js/script.js', { sourcemaps: true })
      .pipe(terser())
      .pipe(rename({prefix: 'min-'}))
      .pipe(dest('./dist/js', { sourcemaps: '.' }));
  }

  // Browsersync Tasks
function browsersyncServe(cb){
    browsersync.init({
      server: {
        baseDir: '.'
      }
    });
    cb();
  }

  function browsersyncReload(cb){
    browsersync.reload();
    cb();
  }
  
  // Watch Task
  function watchTask(){
    watch('*.html', browsersyncReload);
    watch(['src/scss/**/*.scss', 'src/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
  }

// 実行
exports.default = series(
    icon,
    minImageTask,
    copyFiles,
    scssTask,
    jsTask,
    minCssTask,
    browsersyncServe,
    watchTask,
  );