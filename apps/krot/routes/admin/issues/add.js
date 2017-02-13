var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Issue = Model.Issue;

	var uploadImage = Params.upload.image;


	module.index = function(req, res, next) {
		Issue.find().sort('-date').skip(0).limit(1).exec(function(err, issue) {
			Issue.count(function(err, count) {
				res.render('admin/issues/add.jade', { count: (issue && issue.length && issue[0].numb) || count });
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
		issue.numb = post.numb;
		issue.style = post.style;
		issue.columns = post.columns;

		uploadImage(issue, 'issues', 'logo', files.logo && files.logo[0], null, function(err, work) {
			if (err) return next(err);

			uploadImage(issue, 'issues', 'background', files.background && files.background[0], null, function(err, work) {
				if (err) return next(err);

				issue.save(function(err, issue) {
					if (err && err.code == 11000) return res.send(post.numb + ' is dublicate number!');
					else if (err) return next(err);

					res.redirect('/admin/issues');
				});
			});
		});
	};


	return module;
};