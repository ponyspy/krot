var shortid = require('shortid');
var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Issue = Model.Issue;

	var uploadImage = Params.upload.image;


	module.index = function(req, res, next) {
		Issue.find().sort('-date').skip(0).limit(1).exec(function(err, issue) {
			Issue.count(function(err, count) {
				res.render('admin/issues/add.pug', { count: (issue && issue.length && issue[0].numb) || count });
			});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var issue = new Issue();

		issue._short_id = shortid.generate();
		issue.status = post.status;
		issue.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		issue.theme = post.theme;
		issue.description = post.description;
		issue.numb = post.numb;
		issue.style = post.style;
		issue.columns = post.columns;

		async.series([
			async.apply(uploadImage, issue, 'issues', 'logo', 1200, files.logo && files.logo[0], null),
			async.apply(uploadImage, issue, 'issues', 'background', 1600, files.background && files.background[0], null)
		], function(err, results) {
			issue.save(function(err, issue) {
				if (err && err.code == 11000) return res.send(post.numb + ' is dublicate number!');
				else if (err) return next(err);

				res.redirect('/admin/issues');
			});
		});
	};


	return module;
};