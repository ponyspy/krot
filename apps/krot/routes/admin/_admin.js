var express = require('express');
var multer = require('multer');

var upload = multer({ dest: __glob_root + '/uploads/' });

var admin = {
	main: require('./main.js'),
	issues: require('./issues/_issues.js'),
	about: require('./about.js'),
	users: require('./users/_users.js'),
	options: require('./options.js')
};

var checkAuth = function(req, res, next) {
	req.session.user_id
		? next()
		: res.redirect('/auth');
};

module.exports = (function() {
	var router = express.Router();

	router.route('/').get(checkAuth, admin.main.index);

	router.route('/about')
		.get(checkAuth, admin.about.edit)
		.post(checkAuth, admin.about.edit_form);

	router.use('/issues', checkAuth, upload.single('logo'), admin.issues);
	router.use('/users', checkAuth, admin.users);

	return router;
})();