var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var articles = {
	index: require('./index.js')(Model),
	article: require('./article.js')(Model),
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(articles.index.index)
		.post(articles.index.get_articles);

	router.route('/:article_id')
		.get(articles.article.index)
		.post(articles.article.hole);

	return router;
})();