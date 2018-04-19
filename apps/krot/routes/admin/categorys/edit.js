module.exports = function(Model) {
	var module = {};

	var Category = Model.Category;


	module.index = function(req, res, next) {
		var id = req.params.id;

		Category.findById(id).exec(function(err, category) {
			if (err) return next(err);

			res.render('admin/categorys/edit.pug', {category: category});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var id = req.params.id;

		Category.findById(id).exec(function(err, category) {
			if (err) return next(err);

			category.title = post.title;
			category.description = post.description;
			category.type = post.type;
			category.status = post.status;

			category.save(function(err, category) {
				if (err) return next(err);

				res.redirect('/admin/categorys');
			});
		});
	};


	return module;
};