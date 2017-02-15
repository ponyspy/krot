var shortid = require('shortid');
var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Article = Model.Article;
	var Category = Model.Category;

	var uploadImagesArticle = Params.upload.image_article;
	var uploadImage = Params.upload.image;


	module.index = function(req, res, next) {
		Category.find().exec(function(err, categorys) {
			if (err) return next(err);

			res.render('admin/articles/add.jade', {categorys: categorys});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var article = new Article();

		article._short_id = shortid.generate();
		article.status = post.status;
		article.categorys = post.categorys == '' ? [] : post.categorys;
		article.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		article.title = post.title;
		article.sym = post.sym;
		article.intro = post.intro;
		article.description = post.description;

		async.parallel([
			function(callback) {
				uploadImage(article, 'articles', 'cover', files.cover && files.cover[0], null, callback);
			},
			function(callback) {
				uploadImage(article, 'articles', 'base', files.base && files.base[0], null, callback);
			},
			function(callback) {
				uploadImage(article, 'articles', 'hover', files.hover && files.hover[0], null, callback);
			},
			function(callback) {
				uploadImagesArticle(article, post, callback);
			}
		], function(err, results) {
			if (err) return next(err);

			article.save(function(err, article) {
				if (err) return next(err);

				res.redirect('/admin/articles');
			});
		});
	};


	return module;
};