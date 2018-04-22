var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Article = Model.Article;
	var Category = Model.Category;

	var uploadImagesArticlePreview = Params.upload.image_article_preview;
	var uploadImagesArticle = Params.upload.image_article;
	var uploadImage = Params.upload.image;
	var filesUpload = Params.upload.files_upload;
	var filesDelete = Params.upload.files_delete;


	module.index = function(req, res, next) {
		var id = req.params.article_id;

		Article.findById(id).exec(function(err, article) {
			if (err) return next(err);

			Category.find().exec(function(err, categorys) {
				if (err) return next(err);

				uploadImagesArticlePreview(article, function(err, article) {
					if (err) return next(err);

					res.render('admin/articles/edit.pug', { article: article, categorys: categorys });
				});
			});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.article_id;

		Article.findById(id).exec(function(err, article) {
			if (err) return next(err);

			article.status = post.status;
			article.categorys = post.categorys.filter(function(category) { return category != 'none'; });
			article.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			article.title = post.title;
			article.sym = post.sym ? post.sym : undefined;
			article.intro = post.intro;
			article.description = post.description;

			async.series([
				async.apply(uploadImage, article, 'articles', 'cover', 1200, files.cover && files.cover[0], post.cover_del),
				async.apply(uploadImage, article, 'articles', 'base', 600, files.base && files.base[0], post.base_del),
				async.apply(uploadImage, article, 'articles', 'hover', 600, files.hover && files.hover[0], post.hover_del),
				async.apply(uploadImagesArticle, article, post),
				async.apply(filesDelete, article, 'files', post, files),
				async.apply(filesUpload, article, 'articles', 'files', post, files)
			], function(err, results) {
				if (err) return next(err);

				article.save(function(err, article) {
					if (err) return next(err);

					res.redirect('back');
				});
			});
		});
	};


	return module;
};