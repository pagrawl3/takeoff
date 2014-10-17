#! /usr/bin/env node

var gulp 	= require('gulp');
var git  	= require('gulp-git');
var install	= require('gulp-install');
var del 	= require('del');
var chalk 	= require('chalk');
var inquirer= require('inquirer');
var fs 		= require('fs');

module.exports = function() {
	// Run git init
	// src is the root folder for git to initialize
	gulp.task('init', function(){
		return git.init(function (err) {
			if (err) throw err;
		});
	});

	gulp.task('clone', function(){
		return git.clone('https://github.com/pagrawl3/takeoff.git', function (err) {
			if (err) throw err;
			gulp.start('install');
		})

	});

	gulp.task('copy', function(){
		return gulp.src(process.cwd()+'/takeoff/templates/koa/**/*')
		.pipe(gulp.dest('.'))
		
	});

	gulp.task('clean', ['copy'], function(cb) {
		return del(['./takeoff'], cb);
	})

	gulp.task('install', ['copy', 'clean'], function() {
		return gulp.src(['./bower.json', './package.json'])
		.pipe(install());
	})


	gulp.task('default', ['init', 'clone']);

	var ascii = fs.readFileSync(__dirname+'/ascii.txt', "utf8").split("break");
	console.log('\n\n');
	console.log(chalk.white.bold(ascii[0])+chalk.green(ascii[1])+chalk.red(ascii[2]));
	console.log(chalk.red.bold.inverse.bgWhite('              TAKEOFF                 '));
	console.log(chalk.green('Houston, pilots are ready to  boogie'));
	console.log(chalk.white.bold('Takeoff helps you scaffold node apps so that you spend more time building new things than just setting them up'));
	console.log('\n');

	var questions = [
		{
			type 	: "list",
			message	: "Select a base nodeJS framework",
			name 	: "framework",
			choices : ["Koa"]
		},
		// {
		// 	type 	: "checkbox",
		// 	message	: "Choose additional server components",
		// 	name 	: "components",
		// 	choices : [
		// 		{name : "mongoDB", value: "mongo"},
		// 		{name : "socketIO", value: "sockets"},
		// 		{name : "user authentication", value: "auth"}
		// 	]
		// },
		// {
		// 	type 	: "checkbox",
		// 	message	: "Choose additional browser libraries",
		// 	name 	: "libraries",
		// 	choices : [
		// 		{name : "Polymer Web Components", value: "mongo"},
		// 		{name : "Bootstrap by Twitter", value: "Bootstrap"},
		// 	]
		// },
		{
			type 	: "confirm",
			message	: "Launch?",
			name 	: "shouldLaunch",
			default : true
		}
	]
	inquirer.prompt(questions, function( answers ) {
		var framework 	= answers.framework.toLowerCase();
		var components 	= answers.components;
		var libraries 	= answers.libraries; 

		if (answers.shouldLaunch)
			gulp.start('default');
	});
}();