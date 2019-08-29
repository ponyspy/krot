var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Mirror = Model.Mirror;


	module.index = function(req, res, next) {
		Mirror.find().sort('-date').limit(10).exec(function(err, mirrors) {
			if (err) return next(err);

			Mirror.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/mirrors', {mirrors: mirrors, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Mirror.find({ $text : { $search : post.context.text } } )
			: Mirror.find();

		if (post.context.status && post.context.status == 'default') {
			Query.where('status').ne('hidden');
		}

		if (post.context.status && post.context.status == 'hidden') {
			Query.where('status').equals('hidden');
		}

		Query.count(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, mirrors) {
				if (err) return next(err);

				if (mirrors.length > 0) {
					var opts = {
						mirrors: mirrors,
						load_list: true,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(pug.renderFile(__app_root + '/views/admin/mirrors/_mirrors.pug', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};