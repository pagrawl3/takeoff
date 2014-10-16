#! /usr/bin/env node

var gulp 	= require('gulp');
var git  	= require('gulp-git');

module.exports = function() {
	// Run git init
	// src is the root folder for git to initialize
	gulp.task('init', function(){
		git.init(function (err) {
			if (err) throw err;
		});
	});

	gulp.task('clone', function(){
		git.clone('https://github.com/pagrawl3/launchpad.git', function (err) {
			if (err) throw err;
			console.log("HERE");
			gulp.start('copy');
		});
	});

	gulp.task('copy', function(){
		console.log("COPYING", process.cwd()+'/'+'launchpad/templates/koa/**/*');
		gulp.src('./launchpad/templates/koa/**/*', { base: process.cwd() })
		    .pipe(gulp.dest('build/'));
	});

	gulp.task('default', ['init', 'clone']);
	gulp.start('default');
}();