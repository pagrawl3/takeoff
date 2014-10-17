#! /usr/bin/env node

var gulp 	= require('gulp');
var git  	= require('gulp-git');
var install	= require('gulp-install');
var del 	= require('del');

module.exports = function() {
	// Run git init
	// src is the root folder for git to initialize
	gulp.task('init', function(){
		return git.init(function (err) {
			if (err) throw err;
		});
	});

	gulp.task('clone', function(){
		return git.clone('https://github.com/pagrawl3/launchpad.git', function (err) {
			if (err) throw err;
			gulp.start('install');
		})

	});

	gulp.task('copy', function(){
		return gulp.src(process.cwd()+'/launchpad/templates/koa/**/*')
		.pipe(gulp.dest('.'))
		
	});

	gulp.task('clean', ['copy'], function(cb) {
		return del(['./launchpad'], cb);
	})

	gulp.task('install', ['copy', 'clean'], function() {
		return gulp.src(['./bower.json', './package.json'])
		.pipe(install());
	})


	gulp.task('default', ['init', 'clone']);
	gulp.start('default');
}();