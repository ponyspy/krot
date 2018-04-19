module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;

	module.index = function(req, res, next) {
		var user_id = req.session.user_id;
		var id = req.params.article_id;

		var Query = user_id
			? Article.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] })
			: Article.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).where('status').ne('hidden');

		Query.populate('categorys').exec(function(err, article) {
			if (err || !article) return next(err);
			var categorys = article.categorys.map(function(category) { return category._id; });

			Article.aggregate([
				{ $match: { status: { $ne: 'hidden' } }	},
				{ $match: { _id : { $ne: article._id } } },
				{ $match: { categorys: { $in: categorys } } },
				{ $sample: { size: 4 } }]).exec(function(err, summary) {

				if (err) return next(err);

				res.render('main/articles/article.pug', { article: article, summary: summary });
			});
		});
	};

	return module;
};