const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const fileInclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();

async function loadImagemin() {
    const imagemin = await import('gulp-imagemin');
    return imagemin.default;
}

// Sass dosyalarını derleme
function compileSass() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
}

// CSS dosyalarını birleştirme ve küçültme
function minifyCSS() {
    return gulp.src([
        './dist/css/*.css',
        ])
        .pipe(concat('app.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
}

// JavaScript dosyalarını birleştirme ve küçültme
function minifyJS() {
    return gulp.src([
        './node_modules/jquery/dist/jquery.min.js',
        './src/js/**/*.js',
    ]).pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
}

// HTML dosyalarını include etme
function includeHTML() {
    return gulp.src(['./src/**/*.html', '!./src/partials/**'])
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
}

// Görselleri optimize etme ve dist klasörüne kopyalama
async function optimizeImages() {
    const imagemin = await loadImagemin();
    return gulp.src('./src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'))
        .pipe(browserSync.stream());
}

// BrowserSync'i başlatma
function serve(done) {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
    done();
}

// Değişiklikleri izleme
function watchFiles() {
    gulp.watch('./src/scss/**/*.scss', compileSass);
    gulp.watch('./src/js/**/*.js', minifyJS);
    gulp.watch(['./src/**/*.html', './src/partials/**/*.html'], includeHTML);
    gulp.watch('./src/img/**/*', optimizeImages);
}

// Gulp görevlerini tanımlama
const build = gulp.series(compileSass, gulp.parallel(minifyCSS, minifyJS, includeHTML, optimizeImages));
const watch = gulp.series(build, serve, watchFiles);

// Gulp görevlerini dışa aktarma
exports.compileSass = compileSass;
exports.minifyCSS = minifyCSS;
exports.minifyJS = minifyJS;
exports.includeHTML = includeHTML;
exports.optimizeImages = optimizeImages;
exports.build = build;
exports.watch = watch;