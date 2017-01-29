var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Issue = Model.Issue;

	// var uploadImages = Params.upload.images;


	module.index = function(req, res, next) {
		var id = req.params.issue_id;

		Issue.findById(id).exec(function(err, issue) {
			if (err) return next(err);

			res.render('admin/issues/edit.jade', { issue: issue });
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var id = req.params.issue_id;

		Issue.findById(id).exec(function(err, issue) {
			if (err) return next(err);

			issue.status = post.status;
			issue.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			issue.numb = post.numb;
			issue.style = post.style;


			issue.save(function(err, issue) {
				if (err) return next(err);

				res.redirect('/admin/issues');
			});
		});
	};


	return module;
};