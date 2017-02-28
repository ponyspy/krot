module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;

	module.index = function(req, res, next) {
		return res.redirect('/');

		var Query = req.session.user_id
			? Issue.find()
			: Issue.where('status').ne('hidden');

		Query.sort('-date').exec(function(err, issues) {
			if (err) return next(err);

			res.render('main/issues/index.jade', { issues: issues });
		});
	};

	return module;
};