var jade = require('jade');

module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;
	var Article = Model.Article;


	module.index = function(req, res, next) {
		Issue.find().sort('-date').limit(10).exec(function(err, issues) {
			if (err) return next(err);

			Issue.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/issues', {issues: issues, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Issue.find({ $text : { $search : post.context.text } } )
			: Issue.find();

		Query.count(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, issues) {
				if (err) return next(err);

				if (issues.length > 0) {
					var opts = {
						issues: issues,
						load_list: true,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(jade.renderFile(__app_root + '/views/admin/issues/_issues.jade', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	module.get_articles = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Article.find({ $text : { $search : post.context.text } } )
			: Article.find();

		Query.sort('-date').lean().exec(function(err, articles) {
			if (err) return next(err);

			if (articles.length > 0) {
				var opts = {
					articles: articles,
					compileDebug: false, debug: false, cache: true, pretty: false
				};

				res.send(jade.renderFile(__app_root + '/views/admin/issues/_get_articles.jade', opts));
			} else {
				res.send('end');
			}
		});
	};


	return module;
};