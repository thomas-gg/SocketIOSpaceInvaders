var gulp = require('gulp'),
terser = require('gulp-terser'),
concat = require('gulp-concat');

gulp.task('minify', function () {
    return gulp.src([
"public/js/Alien.js",
"public/js/Ship.js",
"public/js/Bomb.js",
"public/js/Explosion.js",
      ])
      .pipe(terser())
      .pipe(concat('game-bundle.min.js'))
      .pipe(gulp.dest('public/js'))
});
