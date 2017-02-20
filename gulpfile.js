const gulp = require('gulp');
const webserver = require('gulp-webserver');
const eslint = require('gulp-eslint');
const rimraf = require('rimraf');
const runSequence = require('run-sequence');
const gwebpack = require('gulp-webpack');
const watch = require('gulp-watch');

const config = {
    src: {
        all: './',
        siteFiles: [
            'index.html',
            'build/*',
            'bower_components/**/*',
            'client/**/*.js',
            'client/**/*.css',
        ],
        build: 'build',
        dist: 'dist',
        deploy: 'dist/**/*',
        jsDir: 'client',
        js: 'client/**/*.js',
    }
};

gulp.task('lint', () => {
    return gulp.src(config.src.js)
        .pipe(eslint({useEslintrc: true}))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

/**
 * Watches the js for file changes and calls build
 */
gulp.task('watch', () => {
    watch(config.src.js, () => {
        runSequence('lint', 'webpack');
    });
});

/**
 * Packs the UI into a single file
 */
gulp.task('webpack', () => {
    return gulp.src(config.src.js)
        .pipe(gwebpack({
            devtool: 'source-map',
            output: {
                filename: 'bundle.js',
            },
            module: {
                loaders: [{
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel',
                }],
            },
            plugins: [
                // new webpack.optimize.UglifyJsPlugin({minimize: true})
            ],
        }))
        .pipe(gulp.dest(config.src.build));
});

/*
 * Clean out the dist directory so we don't have any excess junk
 */
gulp.task('clean', (cb) => {
    rimraf(config.src.dist, cb);
});

/*
 * Copy static content into a single point for deployment, without the extra cruft.
 */
gulp.task('site', () => {
    return gulp.src(config.src.siteFiles, {'base': '.'}).pipe(gulp.dest(config.src.dist));
});

/*
 * Runs all the required tasks to create distributable site package in output folder.
 */
gulp.task('build', (cb) => {
    return runSequence(
        'lint',
        'webpack',
        'site',
        cb);
});

/**
 * Starts the server for the 'serve' task
 */
gulp.task('serve-server', () => {
    gulp.src(config.src.all)
        .pipe(webserver({
            path: '/',
            livereload: false,
            defaultFile: 'index.html',
            open: false,
        }));
});

/*
 * Live-reload server to make the app available (localhost:8000) and auto-refresh when files change.
 */
gulp.task('serve', () => {
    runSequence('lint', 'webpack', 'watch', 'serve-server');
});

/**
 * Full deploy cycle.
 */
gulp.task('deploy', (cb) => {
    runSequence(
        'clean',
        'build',
        cb);
});

gulp.task('test', ['lint']);

gulp.task('default', ['test', 'serve']);
