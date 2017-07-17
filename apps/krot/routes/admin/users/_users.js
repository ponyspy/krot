var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	validateEmail: require('../_params/auth').validateEmail,
	validatePassword: require('../_params/auth').validatePassword
}

var users = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(users.list.index)

	router.route('/add')
		.get(users.add.index)
		.post(users.add.form);

	router.route('/edit/:id')
		.get(users.edit.index)
		.post(users.edit.form);

	router.route('/remove')
		.post(users.remove.index);

	return router;
})();