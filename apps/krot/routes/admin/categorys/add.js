var shortid = require('shortid');
var moment = require('moment');

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
		category.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		category.status = post.status;

		category.save(function(err, category) {
			if (err) return next(err);

			res.redirect('/admin/categorys');
		});
	};


	return module;
};