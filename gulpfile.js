var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var server = require("browser-sync").create();
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var htmlmin = require("gulp-htmlmin");
var uglify = require("gulp-uglify");
var del = require("del");
var buildFolde = "build";

// ---
gulp.task("copy", function () {
  return gulp.src([
    "src/fonts/**/*.{woff,woff2}",
    "src/img/**",
    "src/js/**",
    "src/*.ico"
  ], {
    base: "src"
  })
    .pipe(gulp.dest(buildFolde));
});

// ---
gulp.task("clean", function () {
  return del(buildFolde);
});

// ---
gulp.task("css", function () {
  return gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass({
      includePaths: require("scss-resets").includePaths
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest(buildFolde + "/css"))
    .pipe(server.stream());
});

// ---
gulp.task("html", function () {
  return gulp.src("src/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(buildFolde));
});

// ---
gulp.task("jsmin", function () {
  return gulp.src("src/js/script.js")
    .pipe(uglify())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest(buildFolde + "/js"));
});

// ---
gulp.task("sprite", function () {
  return gulp.src("src/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(buildFolde + "/img"));
});

// ---
gulp.task("server", function () {
  server.init({
    server: buildFolde + "/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
  // gulp.watch("src/js/**/*.js", gulp.series("jsmin", "refresh"));
  gulp.watch("src/img/**/*.{jpg,png,webp,svg}", gulp.series("html", "css", "refresh"));
  gulp.watch("src/*.html", gulp.series("html", "refresh"));
});

// ---
gulp.task("refresh", function (done) {
  server.reload();
  done();
});

// npx gulp images
gulp.task("images", function () {
  return gulp.src("src/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("src/img"));
});

// npx gulp webp
gulp.task("webp", function () {
  return gulp.src("src/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("src/img"));
});

gulp.task("build", gulp.series("clean", "copy", "css", "html"/*, "jsmin" */));
gulp.task("start", gulp.series("build", "server"));
