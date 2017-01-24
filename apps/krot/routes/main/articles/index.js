module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;

	module.index = function(req, res) {
		Article.where('status').ne('hidden').sort('-date').exec(function(err, articles) {
			res.render('main/articles/index.jade', { articles: articles });
		});
	};

	return module;
};