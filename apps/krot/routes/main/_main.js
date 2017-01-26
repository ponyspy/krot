var express = require('express');

var Model = require(__app_root + '/models/main.js');

var main = {
	index: require('./index.js')(Model),
	content: require('./content.js'),
	issues: require('./issues/_issues.js')(Model),
	articles: require('./articles/_articles.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(main.index.index);

	router.route('/issues')
		.use(main.issues);

	router.route('/articles')
		.use(main.articles);

	router.route('/about')
		.get(main.content.about);

	return router;
})();