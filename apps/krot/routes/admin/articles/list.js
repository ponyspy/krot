var jade = require('jade');

module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;


	module.index = function(req, res, next) {
		Article.find().sort('-date').limit(10).exec(function(err, articles) {
			if (err) return next(err);

			Article.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/articles', {articles: articles, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Article.find({ $text : { $search : post.context.text } } )
			: Article.find();

		Query.count(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, articles) {
				if (err) return next(err);

				if (articles.length > 0) {
					var opts = {
						articles: articles,
						load_list: true,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(jade.renderFile(__app_root + '/views/admin/articles/_articles.jade', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};