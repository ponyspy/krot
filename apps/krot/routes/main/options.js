var sitemap = require('sitemap');

module.exports = function(Model) {
	var module = {};

	var Link = Model.Link;
	var Article = Model.Article;
	var Issue = Model.Issue;

	module.link = function(req, res, next) {
		var name = req.params.name;

		Link.findOne({ '$or': [ { title: name }, { __short_id: name } ] }).where('status').ne('hidden').exec(function(err, link) {
			if (!link) return next(err);

			res.redirect(link.url);
		});
	};


	module.sitemap = function(req, res, next) {

		Article.where('status').ne('hidden').exec(function(err, articles) {
			Issue.where('status').ne('hidden').exec(function(err, issues) {

				var links = [
					{ url: '/' },
					{ url: '/about' },
					{ url: '/articles' },
					{ url: '/issues' },
				];

				var stream = new sitemap.SitemapStream({ hostname: 'https://' + req.hostname });

				stream.pipe(res);
				res.type('xml');

				links.forEach(function(link) {
					return stream.write(link);
				});

				issues.forEach(function(issue) {
					return stream.write({
						url: '/issues/' + issue.numb
					});
				});

				articles.forEach(function(article) {
					return stream.write({
						url: '/articles/' + (article.sym ? article.sym : article._short_id)
					});
				});

				stream.end();

				stream.on('error', function(err) {
					return next(err);
				});

				stream.on('data', function(chunk) {
					res.write(data);
				});

				stream.on('end', function() {
					res.end();
				});

			});
		});

	};


	return module;
};