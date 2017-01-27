var express = require('express');

var Model = require(__app_root + '/models/main.js');

var main = {
	index: require('./index.js')(Model),
	content: require('./content.js'),
	issues: require('./issues/_issues.js'),
	articles: require('./articles/_articles.js')
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(main.index.index);

	router.use('/issues', main.issues);

	router.use('/articles', main.articles);

	router.route('/about')
		.get(main.content.about);

	return router;
})();