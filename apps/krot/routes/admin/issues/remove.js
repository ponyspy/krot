var rimraf = require('rimraf');

module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;


	module.index = function(req, res, next) {
		var id = req.body.id;

		Issue.findByIdAndRemove(id).exec(function(err) {
			if (err) return next(err);

			rimraf(__app_root + '/public/cdn/images/issues/' + id, { glob: false }, function(err) {
				if (err) return next(err);

				res.send('ok');
			});
		});

	};


	return module;
};