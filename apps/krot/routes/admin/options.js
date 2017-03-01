var gm = require('gm').subClass({ imageMagick: true });
var rimraf = require('rimraf');

module.exports.preview = function(req, res) {
	var file = req.file;

	gm(file.path).identify({ bufferStream: true }, function(err, meta) {
		var new_path = '/preview/' + Date.now() + '.' + (meta['Channel depth'].Alpha ? 'png' : 'jpg');

		this.resize(meta.size.width > 600 ? 600 : false, false);
		this.quality(meta.size.width >= 600 ? 82 : 100);
		this.write(__glob_root + '/public' + new_path, function (err) {
			rimraf(file.path, { glob: false }, function() {
				res.send(new_path);
			});
		});
	});
};