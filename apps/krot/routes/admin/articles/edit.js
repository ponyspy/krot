var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Article = Model.Article;

	var uploadImagesArticlePreview = Params.upload.image_article_preview;
	var uploadImagesArticle = Params.upload.image_article;
	var uploadImage = Params.upload.image;


	module.index = function(req, res, next) {
		var id = req.params.article_id;

		Article.findById(id).exec(function(err, article) {
			if (err) return next(err);

			uploadImagesArticlePreview(article, function(err, article) {
				if (err) return next(err);

				res.render('admin/articles/edit.jade', { article: article });
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
			article.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			article.title = post.title;
			article.intro = post.intro;
			article.description = post.description;

			uploadImage(article, 'articles', 'logo', files.logo && files.logo[0], post.logo_del, function(err, work) {
				if (err) return next(err);

				uploadImage(article, 'articles', 'background', files.background && files.background[0], post.background_del, function(err, work) {
					if (err) return next(err);

					uploadImagesArticle(article, post, function(err, article) {
						if (err) return next(err);

						article.save(function(err, article) {
							if (err) return next(err);

							res.redirect('/admin/articles');
						});
					});
				});
			});
		});
	};


	return module;
};