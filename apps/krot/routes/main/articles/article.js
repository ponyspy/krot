module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;

	module.index = function(req, res, next) {
		var id = req.params.article_id;

		Article.find({ $or: [ { '_short_id': id }, { 'sym': id } ] }).exec(function(err, articles) {
			if (!articles || !articles.length) return next(err);

			res.render('main/articles/article.jade', { article: articles[0] });
		});
	};

	return module;
};