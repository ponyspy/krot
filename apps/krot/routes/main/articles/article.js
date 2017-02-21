module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;

	module.index = function(req, res, next) {
		var id = req.params.article_id;

		Article.find({ $or: [ { '_short_id': id }, { 'sym': id } ] }).populate('categorys').exec(function(err, articles) {
			if (!articles || !articles.length) return next(err);
			var categorys = articles[0].categorys.map(function(category) { return category._id; });

			Article.find({ categorys: { '$in': categorys } }).where('status').ne('hidden').limit(5).exec(function(err, summary) {
				if (!summary || !summary.length) return next(err);

				res.render('main/articles/article.jade', { article: articles[0], summary: summary });
			});
		});
	};

	return module;
};