var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var mime = require('mime');
var svgo = require('svgo');
var rimraf = require('rimraf');

module.exports.preview = function(req, res) {
	var file = req.file;
	var file_name = Date.now();

	if (mime.getExtension(file.mimetype) == 'svg') {
		var SVGO = new svgo({ plugins: [{ convertShapeToPath: false }] });
		var new_path = '/preview/' + file_name + '.svg';

		fs.readFile(file.path, function(err, data) {
			SVGO.optimize(data, function(result) {
				fs.writeFile(__glob_root + '/public' + new_path, result.data, function(err) {
					rimraf(file.path, { glob: false }, function() {
						res.send(new_path);
					});
				});
			});
		});
	} else if (/jpeg|png|gif/.test(mime.getExtension(file.mimetype))) {
		gm(file.path).identify({ bufferStream: true }, function(err, meta) {
			var new_path = mime.getExtension(file.mimetype) == 'gif'
				? '/preview/' + file_name + '.gif'
				: '/preview/' + file_name + '.' + ((meta['Channel depth'].Alpha || meta['Channel statistics'].Alpha || meta.Alpha) ? 'png' : 'jpg');

			this.resize(meta.size.width > 960 ? 960 : false, false);
			this.quality(meta.size.width >= 960 ? 82 : 100);
			this.write(__glob_root + '/public' + new_path, function (err) {
				rimraf(file.path, { glob: false }, function() {
					res.send(new_path);
				});
			});
		});
	}
};