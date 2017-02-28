var mongoose = require('mongoose');

module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;

	module.index = function(req, res, next) {
		var id = req.params.issue_id;

		var Query = req.session.user_id
			? Issue.findOne({ $or: [ { '_short_id': id }, { 'numb': id } ] })
			: Issue.findOne({ $or: [ { '_short_id': id }, { 'numb': id } ] }).where('status').ne('hidden');

		Query.populate({
			path: 'columns.articles',
			select: 'base hover sym categorys _short_id',
			populate: {
				path: 'categorys',
				select: 'title _short_id'
			}
		}).exec(function(err, issue) {
			if (err || !issue) return next(err);

			res.render('main/issues/issue.jade', { issue: issue });
		});
	};

	return module;
};