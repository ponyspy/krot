var mongoose = require('mongoose');

module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;

	module.index = function(req, res) {
		var id = req.params.issue_id;

		Issue.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).exec(function(err, issue) {
			res.render('main/issues/issue.jade', { issue: issue });
		});
	};

	return module;
};