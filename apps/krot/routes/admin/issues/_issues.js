var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	upload: require('../_params/upload')
};

var issues = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(issues.list.index)
		.post(issues.list.get_list);

	router.route('/get_articles')
		.post(issues.list.get_articles);

	router.route('/add')
		.get(issues.add.index)
		.post(issues.add.form);

	router.route('/edit/:issue_id')
		.get(issues.edit.index)
		.post(issues.edit.form);

	router.route('/remove')
		.post(issues.remove.index);

	return router;
})();