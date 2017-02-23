module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;

	module.index = function(req, res, next) {
		var id = req.params.article_id;

		Article.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).where('status').ne('hidden').populate('categorys').exec(function(err, article) {
			if (err || !article) return next(err);
			var categorys = article.categorys.map(function(category) { return category._id; });

			Article.find({ _id: { '$ne': article._id }, categorys: { '$in': categorys } }).where('status').ne('hidden').limit(5).exec(function(err, summary) {
				if (err) return next(err);

				res.render('main/articles/article.jade', { article: article, summary: summary });
			});
		});
	};

	return module;
};