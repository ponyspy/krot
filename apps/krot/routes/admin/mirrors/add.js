var shortid = require('shortid');
var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Mirror = Model.Mirror;

	var validateDomain = Params.auth.validateDomain;


	module.index = function(req, res) {
		res.render('admin/mirrors/add.pug');
	};


	module.form = function(req, res, next) {
		var post = req.body;

		var mirror = new Mirror();

		if (post.name == '') {
			return next(new Error('Name field is required!'));
		}

		if (!validateDomain(post.name)) {
			return next(new Error('Domain name invalid!'));
		}

		mirror._short_id = shortid.generate();
		mirror.name = post.name;
		mirror.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		mirror.status = post.status;

		mirror.save(function(err, mirror) {
			if (err) return next(err);

			res.redirect('/admin/mirrors');
		});
	};


	return module;
};