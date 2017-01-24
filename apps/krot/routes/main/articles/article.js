module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;

	module.index = function(req, res) {
		var id = req.params.article_id;

		Article.findById(id).exec(function(err, article) {
			res.render('main/articles/article.jade', { article: article });
		});
	};

	return module;
};