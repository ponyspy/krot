var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Link = Model.Link;


	module.index = function(req, res, next) {
		Link.find().sort('-date').limit(10).exec(function(err, links) {
			if (err) return next(err);

			Link.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/links', {links: links, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Link.find({ $text : { $search : post.context.text } } )
			: Link.find();

		if (post.context.status && post.context.status == 'default') {
			Query.where('status').ne('hidden');
		}

		if (post.context.status && post.context.status == 'hidden') {
			Query.where('status').equals('hidden');
		}

		Query.count(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, links) {
				if (err) return next(err);

				if (links.length > 0) {
					var opts = {
						links: links,
						load_list: true,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(pug.renderFile(__app_root + '/views/admin/links/_links.pug', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};