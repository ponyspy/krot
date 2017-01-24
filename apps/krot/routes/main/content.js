var fs = require('fs');

exports.about = function(req, res) {
	fs.readFile(__app_root + '/static/about.html', function(err, html) {
		res.render('main/about.jade', { html: html });
	});
};