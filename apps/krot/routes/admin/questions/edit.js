var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Question = Model.Question;

	var uploadImage = Params.upload.image;


	module.index = function(req, res, next) {
		var id = req.params.question_id;

		Question.findById(id).exec(function(err, question) {
			if (err) return next(err);

			res.render('admin/questions/edit.pug', { question: question });
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.question_id;

		Question.findById(id).exec(function(err, question) {
			if (err) return next(err);

			question.status = post.status;
			question.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			question.title = post.title;
			question.answer = post.answer;
			question.cheats = post.cheats ? post.cheats.trim().replace(/[^a-zA-Z0-9 ]/g, '').split(' ') : [];
			question.stat = { right: 0, total: 0 }

			async.series([
				async.apply(uploadImage, question, 'questions', 'cover', 800, files.cover && files.cover[0], post.cover_del),
			], function(err, results) {
				if (err) return next(err);

				question.save(function(err, question) {
					if (err) return next(err);

					res.redirect('back');
				});
			});
		});
	};


	return module;
};