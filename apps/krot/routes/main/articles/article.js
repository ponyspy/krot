module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;
	var Question = Model.Question;

	module.index = function(req, res, next) {
		var hole_rank = req.session.hole_rank;
		var user_id = req.session.user_id;
		var id = req.params.article_id;

		var Query = user_id
			? Article.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] })
			: Article.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).where('status').ne('hidden');

		Query.populate('categorys').exec(function(err, article) {
			if (err || !article) return next(err);

			if (!user_id && article.status == 'special' && (!hole_rank || hole_rank <= 5)) {
				Question.aggregate().match({'status': {'$ne': 'hidden'}}).sample(1).exec(function(err, question) {
					if (err) return next(err);

					return res.render('main/hole.pug', {question: question[0]});
				});
			} else {
				var categorys = article.categorys.map(function(category) { return category._id; });

				Article.aggregate([
					{ $match: { status: { $ne: 'hidden' } }	},
					{ $match: { _id : { $ne: article._id } } },
					{ $match: { categorys: { $in: categorys } } },
					{ $sample: { size: 4 } }]).exec(function(err, summary) {

					if (err) return next(err);

					res.render('main/articles/article.pug', { article: article, summary: summary });
				});
			}
		});
	};

	module.hole = function(req, res, next) {
		var post = req.body;

		Question.findOne({'_short_id': post.question_id}).exec(function(err, question) {
			question.stat.total += 1;

			if (question.answer.toLowerCase() == post.answer.trim().toLowerCase()) {
				req.session.hole_rank = req.session.hole_rank ? req.session.hole_rank + 1 : 1;
				question.stat.right += 1;
			}

			question.save(function(err) {
				res.send('ok');
			});
		});

	}

	return module;
};