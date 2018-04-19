var pug = require('pug');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;
	var Article = Model.Article;
	var Category = Model.Category;


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

		async.waterfall([
			function(callback) {
				if (post.context.text && post.context.text !== '') {
					callback(null, 'go');
				} else {
					callback(Error('none'));
				}
			},
			function(result, callback) {
				Category.find({ $text : { $search : post.context.text } } ).distinct('_id').exec(callback);
			},
			function(c_ids, callback) {
				Article.find({ 'categorys': { '$in': c_ids } }).distinct('_id').exec(callback);
			},
			function(a_ids, callback) {
				Article.find({ $text : { $search : post.context.text } }).distinct('_id').exec(function(err, a_text_ids) {
					callback(err, a_ids.concat(a_text_ids));
				});
			},
			function(a_ids, callback) {
				var numb = post.context.text.replace(/Номер|номер/g, '').trim();
				var arr_search = Number.isInteger(+numb)
					? [ { 'numb': numb }, { 'columns.articles': { '$in': a_ids } } ]
					: [ { 'columns.articles': { '$in': a_ids } } ];

				callback(null, Issue.find({ '$or': arr_search }));
			}
		], function(err, results) {
			if (err && err.message != 'none') return next(err);

			var Query = results || Issue.find();

			if (post.context.type && post.context.type != 'all') {
				Query.where('type').equals(post.context.type);
			}

			if (post.context.status && post.context.status == 'default') {
				Query.where('status').ne('hidden');
			}

			if (post.context.status && post.context.status == 'hidden') {
				Query.where('status').equals('hidden');
			}

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

						res.send(pug.renderFile(__app_root + '/views/admin/issues/_issues.pug', opts));
					} else {
						res.send('end');
					}
				});
			});
		});
	};


	module.get_articles = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Article.find({ $text : { $search : post.context.text } } )
			: Article.find();

		Query.sort('-date').exec(function(err, articles) {
			if (err) return next(err);

			if (articles.length > 0) {
				var opts = {
					articles: articles,
					compileDebug: false, debug: false, cache: true, pretty: false
				};

				res.send(pug.renderFile(__app_root + '/views/admin/issues/_get_articles.pug', opts));
			} else {
				res.send('end');
			}
		});
	};


	return module;
};