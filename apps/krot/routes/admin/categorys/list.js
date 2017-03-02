var jade = require('jade');

module.exports = function(Model) {
	var module = {};

	var Category = Model.Category;


	module.index = function(req, res, next) {
		Category.find().sort('-date').limit(10).exec(function(err, categorys) {
			if (err) return next(err);

			Category.count().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/categorys', {categorys: categorys, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Category.find({ $text : { $search : post.context.text } } )
			: Category.find();

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

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, categorys) {
				if (err) return next(err);

				if (categorys.length > 0) {
					var opts = {
						categorys: categorys,
						load_list: true,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(jade.renderFile(__app_root + '/views/admin/categorys/_categorys.jade', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};