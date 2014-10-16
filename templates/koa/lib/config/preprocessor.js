var jade 	= require('jade'),
	stylus 	= require('stylus'),
	axis 	= require('axis'),
	fs 		= require('fs'),
	watch 	= require('node-watch');

module.exports = function (app, options) {

	//Add methods to the this object so we can do this.render 
	app.use(function *(next){
		this.directories = {};
		
		setJade		.apply(this, [options]);
		setStylus	.apply(this, [options]);
		
		yield next;
	});
	
	//Setup the watcher to watch the files for autocompiling
	setWatcher(options);
}

function setJade(options) {
	this.directories.jade 	= options.jadeDirectory;
	this.jade 				= function(filename, data) {
		return compileJade(filename, data, options.jadeDirectory);
	}
}

function setStylus(options) {
	this.directories.stylus = options.stylusDirectory;
	this.directories.css 	= options.cssDirectory;
	this.stylus 			= compileStylus;
}

function setWatcher(options) {
	watch(options.stylusDirectory, function(filename) {
		var file = filename.split('/').pop().split('.').shift();
		compileStylus(file, options.stylusDirectory, options.cssDirectory);
	});
}

function compileStylus(filename, stylusDir, cssDir, cb) {
	var stylusPath 	= stylusDir 	+'/'+filename+'.styl',
		cssPath		= cssDir 		+'/'+filename+'.css',		
		styl 		= fs.readFileSync(stylusPath, 'utf8');
	
	stylus(styl)
		.set('compress', true)
		.use(axis())
		.render( function(err, css) {
			fs.writeFileSync(cssPath, css, 'utf8');
			if (cb) cb(err, css)
		});
}

function compileJade(filename, data, jadeDir) {
	var templatePath 		= jadeDir+'/'+filename+'.jade',
		template 			= fs.readFileSync(templatePath, 'utf8'),
		jadeFn 				= jade.compile(template, { filename: templatePath, pretty: true }),
		renderedTemplate 	= jadeFn(data);

	return renderedTemplate;
}