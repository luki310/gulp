var gulp = require("gulp"),
    $ = require("gulp-load-plugins")({
        lazy: true
    }),
    // sass = require("gulp-sass"),
    // autoprefixer = require("gulp-autoprefixer"),
    // plumber = require("gulp-plumber"),
    browserSync = require("browser-sync"),
    del = require("del"),
    // useref = require("gulp-useref"),
    // uglify = require("gulp-uglify"),
    // gulpif = require("gulp-if"),
    // imagemin = require("gulp-imagemin"),
    runSequence = require("run-sequence"),
    argv = require("yargs").argv;
    // gutil = require("gulp-util");

gulp.task("witaj", function() {

    console.log("Witaj w GULP ;)");

});

gulp.task("css", function() {

    $.util.log( $.util.colors.yellow("Compiling SASS to CSS...") );

    return gulp.src("src/sass/style.scss")
        .pipe($.plumber())
        .pipe($.sass.sync({
            outputStyle: "expanded"
        }))
        .pipe($.autoprefixer({
            browsers: ["last 5 version", "IE 10"]
        }))
        .pipe(gulp.dest("src/css/"))
        .pipe(browserSync.stream());

});

gulp.task("server", function() {

    browserSync.init({
        server: "src/"
    });

});

gulp.task("watch", function() {

    gulp.watch("src/sass/**/*.scss", ["css"]);
    gulp.watch(["src/*.html", "src/**/*.js"], browserSync.reload);

});

gulp.task("clean", function() {

    return del("dist/");

});

gulp.task("html", function() {

    return gulp.src("src/*.html")
        .pipe($.useref())
        .pipe( $.if("*.js", $.uglify() ) )
        .pipe(gulp.dest("dist/"));

});

gulp.task("images", function() {

    return gulp.src("dist/img/*", {
            base: "dist"
        })
        .pipe($.imagemin())
        .pipe(gulp.dest("dist/"));

});

gulp.task("copy", function() {

    return gulp.src(["src/css/**/*.css", "src/img/*"], {
        base: "src"
    })
    .pipe(gulp.dest("dist/"));

});


gulp.task("build", function(cb) {

    runSequence("clean", "html", "copy", "images", cb);

});

gulp.task("build:server", ["build"], function() {

    browserSync.init({
        server: "dist/"
    });

});

gulp.task("default", ["css", "server", "watch"]);