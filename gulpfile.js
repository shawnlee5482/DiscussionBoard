// Assigning modules to local variables
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Default task
gulp.task('default', ['less', 'minify-css', 'minify-js', 'copy']);


// Less task to compile the less files and add the banner
gulp.task('less', function() {
    return gulp.src('client/less/discussion.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('client/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('jshint', function() {
  return gulp.src('client/modules/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Minify CSS
gulp.task('minify-css', function() {
    return gulp.src('client/css/discussion.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('client/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src(['client/modules/dashboard.js', 'client/modules/login.js', 'client/modules/topic.js', 'client/modules/user.js'] )
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('client/modules/min'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


// Copy Bootstrap core files from node_modules to vendor directory
gulp.task('jquery', function() {
  return gulp.src(['node_modules/jquery/dist/*.js'])
    .pipe(gulp.dest('client/lib/jquery'))
});

gulp.task('angular', function() {
  return gulp.src(['node_modules/angular/*.js'])
    .pipe(gulp.dest('client/lib/angular'))
});

gulp.task('angular-route', function() {
  return gulp.src(['node_modules/angular-route/*.js'])
    .pipe(gulp.dest('client/lib/angular-route'))
});

gulp.task('angular-cookies', function() {
  return gulp.src(['node_modules/angular-cookies/*.js'])
    .pipe(gulp.dest('client/lib/angular-cookies'))
});

// Copy Bootstrap core files from node_modules to vendor directory
gulp.task('bootstrap', function() {
    return gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('client/lib/bootstrap'))
});

// Copy Bootstrap core files from node_modules to vendor directory
gulp.task('filepicker', function() {
  return gulp.src(['node_modules/filepicker-js/dist/*.js'])
    .pipe(gulp.dest('client/lib/filepicker-js'))
});

// Copy Bootstrap core files from node_modules to vendor directory
gulp.task('angular-filepicker', function() {
  return gulp.src(['bower_components/angular-filepicker/dist/*.js'])
    .pipe(gulp.dest('client/lib/angular-filepicker'))
});


// Copy Magnific Popup core files from node_modules to vendor directory
gulp.task('magnific-popup', function() {
    return gulp.src(['node_modules/magnific-popup/dist/*'])
        .pipe(gulp.dest('client/lib/magnific-popup'))
});

// Copy ScrollReveal JS core JavaScript files from node_modules
gulp.task('scrollreveal', function() {
    return gulp.src(['node_modules/scrollreveal/dist/*.js'])
        .pipe(gulp.dest('client/lib/scrollreveal'))
});

// Copy Font Awesome core files from node_modules to vendor directory
gulp.task('fontawesome', function() {
    return gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('client/lib/font-awesome'))
});

// Copy all dependencies from node_modules
gulp.task('copy', ['jquery', 'angular', 'angular-filepicker', 'angular-cookies', 'angular-route',
  'bootstrap', 'fontawesome', 'magnific-popup', 'scrollreveal']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        proxy: {
            target: 'http://localhost:8000'
        },
    })
});

// Watch Task that compiles LESS and watches for HTML or JS changes and reloads with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function() {
    gulp.watch('client/less/*.less', ['less']);
    gulp.watch('client/css/*.css', ['minify-css']);
    gulp.watch('client/modules/*.js', ['minify-js']);
    gulp.watch('client/modules/*.js', ['jshint']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch(['client/*.html', 'client/partial/*.html'], browserSync.reload);
    gulp.watch('client/modules/**/*.js', browserSync.reload);
});