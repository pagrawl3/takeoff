module.exports = function(app) {
	//__IMPORT ALL THE CONTROLLERS
	var	main 	= require('../app/controllers/main');

	//__Routes
	app.get('/', main.index);
};