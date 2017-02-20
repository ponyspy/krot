var mongoose = require('mongoose');

module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;

	module.index = function(req, res, next) {
		var id = req.params.issue_id;

		Issue.find({ $or: [ { '_short_id': id }, { 'numb': id } ] }).populate({
			path: 'columns.articles',
			select: 'base hover sym categorys _short_id',
			populate: {
				path: 'categorys',
				select: 'title _short_id'
			}
		}).exec(function(err, issues) {
			if (!issues || !issues.length) return next(err);

			res.render('main/issues/issue.jade', { issue: issues[0] });
		});
	};

	return module;
};