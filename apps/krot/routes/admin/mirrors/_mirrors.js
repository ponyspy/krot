var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	auth: require('../_params/auth')
};

var mirrors = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	options: require('./options.js')(Model),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(mirrors.list.index)
		.post(mirrors.list.get_list);

	router.route('/add')
		.get(mirrors.add.index)
		.post(mirrors.add.form);

	router.route('/edit/:id')
		.get(mirrors.edit.index)
		.post(mirrors.edit.form);

	router.route('/remove')
		.post(mirrors.remove.index);

	router.route('/mirrors_apply')
		.post(mirrors.options.mirrors_apply);

	return router;
})();