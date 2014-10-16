var koa 	= require('koa'),
	router	= require('koa-router');

//Configure Koa
var app = koa();
require('./lib/config/koa')(app);

//Configure Preprocessors for Jade & Stylus(with nib)
var options 	= {
	jadeDirectory 		: './lib/app/views/',
	stylusDirectory 	: './lib/assets/stylus/',
	cssDirectory 		: './lib/assets/public/css/'
};
require('./lib/config/preprocessor')(app, options);

//Configure the router
app.use(router(app));
require('./lib/config/router')(app);

//Start the server
require('node-pow')('local', 3000);
app.listen(3000);

//Expose the application
exports = module.exports = app