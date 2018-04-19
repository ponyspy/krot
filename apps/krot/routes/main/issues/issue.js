module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;

	module.index = function(req, res, next) {
		var user_id = req.session.user_id;
		var id = req.params.issue_id;

		var Query = user_id
			? Issue.findOne({ $or: [ { '_short_id': id }, { 'numb': id } ] })
			: Issue.findOne({ $or: [ { '_short_id': id }, { 'numb': id } ] }).where('status').ne('hidden');

		Query.populate({
				path: 'columns.articles',
				match: user_id ? undefined : { 'status': { '$ne': 'hidden' } },
				select: 'base hover sym status categorys _short_id',
			populate: {
				path: 'categorys',
				match: user_id ? undefined : { 'status': { '$ne': 'hidden' } },
				select: 'title status _short_id'
			}
		}).exec(function(err, issue) {
			if (err || !issue) return next(err);

			res.render('main/issues/issue.pug', { issue: issue });
		});
	};

	return module;
};