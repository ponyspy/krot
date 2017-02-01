var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Article = Model.Article;

	// var uploadImages = Params.upload.images;
	var uploadImage = Params.upload.image;


	module.index = function(req, res, next) {
		res.render('admin/articles/add.jade');
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var article = new Article();

		article._short_id = shortid.generate();
		article.status = post.status;
		article.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		article.title = post.title;
		article.intro = post.intro;
		article.description = post.description;

		uploadImage(article, 'articles', 'logo', files.logo && files.logo[0], null, function(err, work) {
			if (err) return next(err);

			uploadImage(article, 'articles', 'background', files.background && files.background[0], null, function(err, work) {
				if (err) return next(err);

				article.save(function(err, article) {
					if (err) return next(err);

					res.redirect('/admin/articles');
				});
			});
		});
	};


	return module;
};