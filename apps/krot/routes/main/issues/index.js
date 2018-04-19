module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;

	module.index = function(req, res, next) {
		var user_id = req.session.user_id;

		var Query = user_id
			? Issue.find()
			: Issue.where('status').ne('hidden');

		Query.sort('-numb').exec(function(err, issues) {
			if (err) return next(err);

			res.render('main/issues/index.pug', { issues: issues });
		});
	};

	return module;
};