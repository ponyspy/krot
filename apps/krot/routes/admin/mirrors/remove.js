var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Mirror = Model.Mirror;


	module.index = function(req, res, next) {
		var id = req.body.id;

		Mirror.findByIdAndRemove(id).exec(function(err) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};