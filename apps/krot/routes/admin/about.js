var fs = require('fs');

exports.edit = function(req, res) {
	fs.readFile(__app_root + '/static/about.html', function(err, content) {
		res.render('admin/about.pug', { content: content });
	});
};

exports.edit_form = function(req, res) {
	var post = req.body;

	fs.writeFile(__app_root + '/static/about.html', post.content, function(err) {
		res.redirect('back');
	});
};