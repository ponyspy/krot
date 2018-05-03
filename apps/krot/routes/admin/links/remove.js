var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Link = Model.Link;


	module.index = function(req, res, next) {
		var id = req.body.id;

		Link.findByIdAndRemove(id).exec(function(err) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};