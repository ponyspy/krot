var fs = require('fs');

exports.about = function(req, res, next) {
	fs.readFile(__app_root + '/static/about.html', function(err, html) {
		if (err) return next(err);

		res.render('main/about.pug', { html: html });
	});
};