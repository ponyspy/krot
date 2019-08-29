var moment = require('moment');

module.exports = function(Model) {
	var module = {};

	var Mirror = Model.Mirror;


	module.index = function(req, res, next) {
		var id = req.params.id;

		Mirror.findById(id).exec(function(err, mirror) {
			if (err) return next(err);

			res.render('admin/mirrors/edit.pug', {mirror: mirror});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var id = req.params.id;

		Mirror.findById(id).exec(function(err, mirror) {
			if (err) return next(err);

			mirror.name = post.name;
			mirror.status = post.status;
			mirror.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);

			mirror.save(function(err, mirror) {
				if (err) return next(err);

				res.redirect('back');
			});
		});
	};


	return module;
};