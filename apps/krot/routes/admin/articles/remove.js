var rimraf = require('rimraf');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;
	var Issue = Model.Issue;


	module.index = function(req, res, next) {
		var id = req.body.id;

		async.parallel([
			function(callback) {
				Issue.update({'columns.$.articles': id}, { $pull: { 'columns.articles': id } }, { multi: true }).exec(callback);
			},
			function(callback) {
				Article.findByIdAndRemove(id).exec(callback);
			},
			function(callback) {
				rimraf(__glob_root + '/public/cdn/' + __app_name + '/images/articles/' + id, { glob: false }, callback);
			},
			function(callback) {
				rimraf(__glob_root + '/public/cdn/' + __app_name + '/files/articles/' + id, { glob: false }, callback);
			}
		], function(err, results) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};