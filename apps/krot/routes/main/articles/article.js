module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;
	var Question = Model.Question;

	var randInt = function(min, max) {
		return Math.floor(min + Math.random() * (max + 1 - min));
	}

	module.index = function(req, res, next) {
		var user_id = req.session.user_id;
		var id = req.params.article_id;

		var Query = user_id
			? Article.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] })
			: Article.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).where('status').ne('hidden');

		Query.populate('categorys').exec(function(err, article) {
			if (err || !article) return next(err);

			var hole_rank = req.session.hole_rank;
			var hole_right = req.session.hole_right || [];

			if (article.status == 'special' && (!hole_rank || hole_rank <= 5)) {
				Question.aggregate().match({'status': {'$ne': 'hidden'}, '_short_id': {'$nin': hole_right}}).sample(1).exec(function(err, question) {
					if (err || !question.length) return next(err);

					return res.render('main/articles/hole.pug', {question: question[0]});
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
				req.session.hole_rank = req.session.hole_rank ? req.session.hole_rank += randInt(1, 3) : 1;
				req.session.hole_right = req.session.hole_right ? req.session.hole_right.concat(question._short_id) : [question._short_id];
				question.stat.right += 1;
			} else {
				var cheat_check = question.cheats.some(function(cheat) {
					return cheat.toLowerCase() == post.answer.trim().toLowerCase();
				});

				if (cheat_check) req.session.hole_rank = 1000;
			}

			question.save(function(err) {
				res.send('ok');
			});
		});

	}

	return module;
};