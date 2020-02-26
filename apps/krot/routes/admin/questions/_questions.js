var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	upload: require('../_params/upload')
};

var questions = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(questions.list.index)
		.post(questions.list.get_list);

	router.route('/add')
		.get(questions.add.index)
		.post(questions.add.form);

	router.route('/edit/:question_id')
		.get(questions.edit.index)
		.post(questions.edit.form);

	router.route('/remove')
		.post(questions.remove.index);

	return router;
})();