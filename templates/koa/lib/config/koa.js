var path 		= require('path');

var logger 		= require('koa-logger'),
	conditional = require('koa-conditional-get'),
	etag 		= require('koa-etag'),
	serve 		= require('koa-static'),
	rewrite		= require('koa-rewrite'),
	compress 	= require('koa-compress'),
	favicon 	= require('koa-favicon'),
	bodyParser 	= require('koa-bodyparser')

module.exports = function (app) {

	//___ADDING BASIC MIDDLEWARE
	//logging requests
	app.use(logger());
	// conditional gets with etags for caching.
	app.use(conditional());
	// add etags
	app.use(etag());
	//serving static files
	app.use(serve(path.resolve(__dirname, '../assets/public/')));
	//serve favicon
	app.use(favicon('../assets/public/favicon.ico'));
	//file compression
	app.use(compress({threshold: 2048, flush: require('zlib').Z_SYNC_FLUSH}));
	//body parser
	app.use(bodyParser());
}