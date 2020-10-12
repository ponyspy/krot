module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;

	module.index = function(req, res, next) {
		Article.where('status').eq('special').populate('categorys').sort('-date').exec(function(err, articles) {
			if (err) return next(err);

			res.render('main/articles/index.pug', { articles: articles });
		});
	};

	module.get_articles = function(req, res, next) {
		res.send('cool');
	}

	return module;
};