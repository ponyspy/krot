var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Issue = Model.Issue;

	var previewImages = Params.upload.preview;
	var uploadImages = Params.upload.images;


	module.index = function(req, res, next) {
		var id = req.params.issue_id;

		issue.findById(id).exec(function(err, issue) {
			if (err) return next(err);

			previewImages(issue.images, function(err, images_preview) {
				if (err) return next(err);

				res.render('admin/issues/edit.jade', { issue: issue, images_preview: images_preview });
			});
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var id = req.params.issue_id;

		Issue.findById(id).exec(function(err, issue) {
			if (err) return next(err);

			issue.status = post.status;
			issue.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			issue.title = post.title;

			uploadImages(issue, 'issues', post.images, function(err, issue) {
				if (err) return next(err);

				issue.save(function(err, issue) {
					if (err) return next(err);

					res.redirect('/admin/issues');
				});
			});
		});
	};


	return module;
};