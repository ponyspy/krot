var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;
	var Category = Model.Category;

	module.index = function(req, res, next) {
		res.render('main/articles/index.pug');
	};

	module.get_articles = function(req, res, next) {
		var post = req.body;

		Category.findOne({ status: { $ne: 'hidden' }, _short_id: post.context.category }).exec(function(err, category) {
			var Query = category
				? Article.find({ 'status': 'special', 'categorys': category._id })
				: Article.find({ 'status': 'special' });

			Query.sort('-date').skip(+post.context.skip).limit(+post.context.limit).populate('categorys').exec(function(err, articles) {
				var opts = {
					articles: articles,
					compileDebug: false, debug: false, cache: true, pretty: false
				};

				if (articles && articles.length > 0) {
					res.send(pug.renderFile(__app_root + '/views/main/articles/_articles.pug', opts));
				} else {
					res.send('end');
				}
			});
		});
	}

	return module;
};