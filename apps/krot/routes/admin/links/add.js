var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model) {
	var module = {};

	var Link = Model.Link;


	module.index = function(req, res) {
		res.render('admin/links/add.pug');
	};


	module.form = function(req, res, next) {
		var post = req.body;

		var link = new Link();

		link._short_id = shortid.generate();
		link.title = post.title;
		link.url = post.url;
		link.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		link.status = post.status;

		link.save(function(err, link) {
			if (err) return next(err);

			res.redirect('/admin/links');
		});
	};


	return module;
};