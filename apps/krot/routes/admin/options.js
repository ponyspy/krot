var gm = require('gm').subClass({ imageMagick: true });
var rimraf = require('rimraf');
var mime = require('mime');


module.exports.preview = function(req, res) {
	var file = req.file;
	var newPath = '/preview/' + Date.now() + '.' + mime.extension(file.mimetype);

	gm(file.path).size({ bufferStream: true }, function(err, size) {

		this.resize(size.width > 600 ? 600 : false, false);
		this.quality(size.width >= 600 ? 82 : 100);
		this.write(__glob_root + '/public' + newPath, function (err) {

			rimraf(file.path, { glob: false }, function() {
				res.send(newPath);
			});
		});
	});
};