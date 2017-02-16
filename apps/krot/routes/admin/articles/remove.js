var rimraf = require('rimraf');

module.exports = function(Model) {
	var module = {};

	var Article = Model.Article;
	var Issue = Model.Issue;


	module.index = function(req, res, next) {
		var id = req.body.id;

		Issue.update({'columns.$.articles': id}, { $pull: { 'columns.articles': id } }, { multi: true }).exec(function(err) {
			if (err) return next(err);

			Article.findByIdAndRemove(id).exec(function(err) {
				if (err) return next(err);

				rimraf(__glob_root + '/public/cdn/' + __app_name + '/images/articles/' + id, { glob: false }, function(err) {
					if (err) return next(err);

					rimraf(__glob_root + '/public/cdn/' + __app_name + '/files/articles/' + id, { glob: false }, function(err) {
						if (err) return next(err);

						res.send('ok');
					});
				});
			});
		});

	};


	return module;
};