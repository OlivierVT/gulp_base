// Load plugins
var gulp = require('gulp'), 
    /*Javascript*/
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    tinypng = require('gulp-tinypng-compress'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,

    /*Change here the name of the folder path were you are working with*/
    currentWorking = '/livre_or'


/*MINIFY Js & Css*/
gulp.task('min-script', function(){
    return gulp.src('src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))    
        .pipe(concat('app.min.js'))
        .pipe(uglify(
        {
            mangle:false,
        }))
        .pipe(gulp.dest('dist/js'))    
})

gulp.task('min-style', function(){
    return gulp.src('src/css/*.css')
        .pipe(autoprefixer(
        {
            browsers: ['last 2 versions'],
        }))
        .pipe(csso(
        {
            debug:true
        }))
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('dist/css'))
})

//TinyPNG - Max 500 images compress for free
gulp.task('img', function(){
    var apiKey = "A2xyJhNgPWrwJtXNPIa9tT2PaCqOBaw4";

    return gulp.src('src/img/**/*.{png,jpg,jpeg}')
        .pipe(tinypng(
        {
            key: apiKey,
            sigFile: 'img/.tinypng-sigs',
            log: true,
            summarise: true      
        }))
        .pipe(gulp.dest('dist/img'));
})

//WATCH: You know nothing Jon Snow
gulp.task('watch', function(){
    var watchStyle = gulp.watch('src/scss/**/*.scss', ['style']);
    var watchScript = gulp.watch('src/js/*.js', ['script']);
    
    watchStyle.on('change', function(e){
        console.log('Event type: ' + e.type); // added, changed, or deleted
        console.log('Event path: ' + e.path); // The path of the modified file
        reload
    });    
    watchScript.on('change', function(e){
        console.log('Event type: ' + e.type); // added, changed, or deleted
        console.log('Event path: ' + e.path); // The path of the modified file
        reload
    });
})

//Browser sync

gulp.task('browserSync', function () {
    var files = [        
        'src/css/**/*.css',
        'src/js/**/*.js',
        'src/img/**/*.jpg',
        'src/img/**/*.png',
        'src/img/**/*.jpeg',
        '.html',
        '.php',
    ];

    browserSync.init(files, {
        proxy: "localhost",
        port: 3306,
        startPath: currentWorking,
        
        logPrefix: "Browser Sync",
        logLevel: "debug",

        ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
        }
    });
});


//Regroup 2 task in one
gulp.task('default',['browserSync','watch']);
gulp.task('minify',['min-style', 'min-script']);


//Independent task
gulp.task('script', function(){
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('src/js'));
})

gulp.task('style', function(){
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css'));
})

