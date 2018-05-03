module.exports = function(Model) {
	var module = {};

	var Link = Model.Link;

	module.link = function(req, res, next) {
		var name = req.params.name;

		Link.findOne({ '$or': [ { title: name }, { __short_id: name } ] }).where('status').ne('hidden').exec(function(err, link) {
			if (!link) return next(err);

			res.redirect(link.url);
		});
	};

	return module;
};