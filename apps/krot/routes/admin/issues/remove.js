var rimraf = require('rimraf');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;


	module.index = function(req, res, next) {
		var id = req.body.id;

		async.parallel([
			function(callback) {
				Issue.findByIdAndRemove(id).exec(callback);
			},
			function(callback) {
				rimraf(__glob_root + '/public/cdn/' + __app_name + '/images/issues/' + id, { glob: false }, callback);
			}
		], function(err, results) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};