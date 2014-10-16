var gulp 		= require('gulp'),
	usemin 		= require('gulp-usemin'),
	uglify 		= require('gulp-uglify'),
	minifyCSS 	= require('gulp-minify-css'),
	concat 		= require('gulp-concat'),
	gulpFilter 	= require('gulp-filter'),
	flatten		= require('gulp-flatten');
	bower_files	= require('main-bower-files'),
	bower 		= require('bower'),
	nodemon 	= require('gulp-nodemon'),
	browserSync = require('browser-sync'),
	imagemin 	= require('gulp-imagemin');
	pngcrush 	= require('imagemin-pngcrush');

	gulp.task('browser-sync', function() {
		browserSync({
			proxy: "localhost:3000",
			files: ['./lib/assets/public/build/**/*.{js,css}']
		});
	});

	gulp.task('install', function(cb) {
		bower.commands.install([], {save: true}, {})
			.on('end', function(installed){
				cb(); // notify gulp that this task is finished
			});
	});

	gulp.task('vendor', ['install'], function() {
		var jsFilter 	= gulpFilter('**/*.js');
		var cssFilter 	= gulpFilter('**/*.css');
		var fontFilter 	= gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf']);
		
		
		return gulp.src(bower_files({"main": "**/*.js"}), { base: './bower_components' })

		// grab vendor js files from bower_components, minify and push in /public
		.pipe(jsFilter)
		.pipe(concat('vendors.js'))
		.pipe(gulp.dest('./lib/assets/public/build/js'))
		.pipe(uglify())
		.pipe(concat('vendors.min.js'))
		.pipe(gulp.dest('./lib/assets/public/build/js'))
		.pipe(jsFilter.restore())

		// grab vendor css files from bower_components, minify and push in /public
		.pipe(cssFilter)
		.pipe(concat('vendor.css'))
		.pipe(gulp.dest('./lib/assets/public/build/css'))
		.pipe(minifyCSS())
		.pipe(concat('vendor.min.css'))
		.pipe(gulp.dest('./lib/assets/public/build/css'))
		.pipe(cssFilter.restore())

		// grab vendor font files from bower_components and push in /public 
		.pipe(fontFilter)
		.pipe(flatten())
		.pipe(gulp.dest('./lib/assets/public/build/fonts'))
	});

	gulp.task('personal', function() {
		var jsFilter 	= gulpFilter('**/*.js');
		var cssFilter 	= gulpFilter('**/*.css');

		return gulp.src(['./lib/assets/public/js/*.js', './lib/assets/public/css/*.css'])
		
		//JS
		.pipe(jsFilter)
		.pipe(concat('index.js'))
		.pipe(gulp.dest('./lib/assets/public/build/js'))
		.pipe(uglify())
		.pipe(concat('index.min.js'))
		.pipe(gulp.dest('./lib/assets/public/build/js'))
		.pipe(jsFilter.restore())

		//CSS
		.pipe(cssFilter)
		.pipe(concat('index.css'))
		.pipe(gulp.dest('./lib/assets/public/build/css'))
		.pipe(minifyCSS())
		.pipe(concat('index.min.css'))
		.pipe(gulp.dest('./lib/assets/public/build/css'))
		.pipe(cssFilter.restore())

	});

	gulp.task('watcher', ['vendor', 'personal'], function() {
		var watchVendor = [
			'./bower_components/**'
		]

		var watchPersonal = [
			'./lib/assets/public/js/**',
			'./lib/assets/public/css/**'
		]

		gulp.watch(watchVendor, ['vendor']);
		gulp.watch(watchPersonal, ['personal']);

		browserSync.init(null, {
			proxy	: "localhost:3000",
			port	: 3001,
			files 	: ['./lib/assets/public/build/**/*.{js,css}']
		});
		
		nodemon({ script: 'app.js', nodeArgs: ['--harmony'], "ignore": ["node_modules/**", "bower_components/**"] })
	});

	gulp.task('image-optim', function() {
		return gulp.src('./lib/assets/public/img/**/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngcrush()]
		}))
		.pipe(gulp.dest('./lib/assets/public/build/img'));
	});

	gulp.task('default', ['watcher', 'image-optim'], function() {
		
	});