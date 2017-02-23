module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;

	module.index = function(req, res, next) {
		return res.redirect('/');

		Issue.where('status').ne('hidden').sort('-date').exec(function(err, issues) {
			if (err) return next(err);

			res.render('main/issues/index.jade', { issues: issues });
		});
	};

	return module;
};