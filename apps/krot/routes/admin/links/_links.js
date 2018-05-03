var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var links = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model),
	edit: require('./edit.js')(Model),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(links.list.index)
		.post(links.list.get_list);

	router.route('/add')
		.get(links.add.index)
		.post(links.add.form);

	router.route('/edit/:id')
		.get(links.edit.index)
		.post(links.edit.form);

	router.route('/remove')
		.post(links.remove.index);

	return router;
})();