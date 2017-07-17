var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	upload: require('../_params/upload')
};

var articles = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(articles.list.index)
		.post(articles.list.get_list);

	router.route('/add')
		.get(articles.add.index)
		.post(articles.add.form);

	router.route('/edit/:article_id')
		.get(articles.edit.index)
		.post(articles.edit.form);

	router.route('/remove')
		.post(articles.remove.index);

	return router;
})();