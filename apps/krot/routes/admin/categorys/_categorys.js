var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var categorys = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model),
	edit: require('./edit.js')(Model),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(categorys.list.index)
		.post(categorys.list.get_list);

	router.route('/add')
		.get(categorys.add.index)
		.post(categorys.add.form);

	router.route('/edit/:id')
		.get(categorys.edit.index)
		.post(categorys.edit.form);

	router.route('/remove')
		.post(categorys.remove.index);

	return router;
})();