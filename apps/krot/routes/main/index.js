module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;

	module.index = function(req, res) {
		Issue.where('status').ne('hidden').sort('-date').skip(0).limit(1).exec(function(err, issue) {
			res.redirect('/issues/' + issue.sym || issue._short_id);
		});
	};

	return module;
};