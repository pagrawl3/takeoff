exports.index = function *(next) {
	this.body = this.jade('index');
}