module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;

	module.index = function(req, res, next) {
		Issue.where('status').ne('hidden').sort('-date').skip(0).limit(1).exec(function(err, issues) {
			if (!issue || !issue.length) return next(err);

			res.redirect('/issues/' + issues[0].numb || issues[0]._short_id);
		});
	};

	return module;
};