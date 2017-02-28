module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;

	module.index = function(req, res, next) {
		return res.redirect('/');

		var Query = req.session.user_id
			? Article.find()
			: Article.where('status').ne('hidden');

		Query.sort('-date').exec(function(err, articles) {
			if (err) return next(err);

			res.render('main/articles/index.jade', { articles: articles });
		});
	};

	return module;
};