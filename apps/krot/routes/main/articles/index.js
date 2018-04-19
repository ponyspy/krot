module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;

	module.index = function(req, res, next) {
		return res.redirect('/');

		var user_id = req.session.user_id;

		var Query = user_id
			? Article.find()
			: Article.where('status').ne('hidden');

		Query.sort('-date').exec(function(err, articles) {
			if (err) return next(err);

			res.render('main/articles/index.pug', { articles: articles });
		});
	};

	return module;
};