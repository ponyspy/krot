var moment = require('moment');

module.exports = function(Model) {
	var module = {};

	var Link = Model.Link;


	module.index = function(req, res, next) {
		var id = req.params.id;

		Link.findById(id).exec(function(err, link) {
			if (err) return next(err);

			res.render('admin/links/edit.pug', {link: link});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var id = req.params.id;

		Link.findById(id).exec(function(err, link) {
			if (err) return next(err);

			link.title = post.title;
			link.url = post.url;
			link.status = post.status;
			link.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);

			link.save(function(err, link) {
				if (err) return next(err);

				res.redirect('back');
			});
		});
	};


	return module;
};