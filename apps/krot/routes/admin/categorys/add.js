var shortid = require('shortid');

module.exports = function(Model) {
	var module = {};

	var Category = Model.Category;


	module.index = function(req, res) {
		res.render('admin/categorys/add.pug');
	};


	module.form = function(req, res, next) {
		var post = req.body;

		var category = new Category();

		category._short_id = shortid.generate();
		category.title = post.title;
		category.description = post.description;
		category.type = post.type;
		category.status = post.status;

		category.save(function(err, category) {
			if (err) return next(err);

			res.redirect('/admin/categorys');
		});
	};


	return module;
};