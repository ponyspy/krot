module.exports = function(Model) {
	var module = {};

	var Issue = Model.Issue;
	var Question = Model.Question;

	module.index = function(req, res, next) {
		Issue.findOne().where('status').ne('hidden').sort('-date').exec(function(err, issue) {
			if (!issue) return next(err);

			res.redirect('/issues/' + issue.numb || issue._short_id);
		});
	};

	module.hole = function(req, res, next) {
		Question.aggregate().match({'status': {'$ne': 'hidden'}}).sample(1).exec(function(err, question) {

			return res.render('main/hole.pug', {question: question[0]});
		});
	};

	return module;
};