module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;

	module.index = function(req, res) {
		return res.redirect('/');

		Issue.where('status').ne('hidden').sort('-date').exec(function(err, issues) {
			res.render('main/issues/index.jade', { issues: issues });
		});
	};

	return module;
};