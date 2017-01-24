module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;

	module.index = function(req, res) {
		var id = req.params.issue_id;

		Issue.findById(id).exec(function(err, issue) {
			res.render('main/issues/issue.jade', { issue: issue });
		});
	};

	return module;
};