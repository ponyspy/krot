module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;

	module.index = function(req, res, next) {
		Issue.findOne().where('status').ne('hidden').sort('-date').exec(function(err, issue) {
			if (!issue) return next(err);

			res.redirect('/issues/' + issue.numb || issue._short_id);
		});
	};

	return module;
};