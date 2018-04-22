var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Issue = Model.Issue;

	var uploadImage = Params.upload.image;


	module.index = function(req, res, next) {
		var id = req.params.issue_id;

		Issue.findById(id).populate('columns.articles').exec(function(err, issue) {
			if (err) return next(err);

			res.render('admin/issues/edit.pug', { issue: issue });
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.issue_id;

		Issue.findById(id).exec(function(err, issue) {
			if (err) return next(err);

			issue.status = post.status;
			issue.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			issue.theme = post.theme;
			issue.description = post.description;
			issue.numb = post.numb;
			issue.style = post.style;
			issue.columns = post.columns;

			async.series([
				async.apply(uploadImage, issue, 'issues', 'logo', 1200, files.logo && files.logo[0], post.logo_del),
				async.apply(uploadImage, issue, 'issues', 'background', 1600, files.background && files.background[0], post.background_del)
			], function(err, results) {
				issue.save(function(err, issue) {
					if (err && err.code == 11000) return res.send(post.numb + ' is dublicate number!');
					else if (err) return next(err);

					res.redirect('back');
				});
			});
		});
	};


	return module;
};