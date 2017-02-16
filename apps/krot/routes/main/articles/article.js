module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;

	module.index = function(req, res) {
		var id = req.params.article_id;

		Article.find({ $or: [ { '_short_id': id }, { 'sym': id } ] }).exec(function(err, article) {
			if (!issue || !issue.length) return next(err);

			res.render('main/articles/article.jade', { article: article[0] });
		});
	};

	return module;
};