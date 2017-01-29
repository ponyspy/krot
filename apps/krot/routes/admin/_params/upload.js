var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var public_path = __glob_root + '/public';
var preview_path = __glob_root + '/public/preview/';

module.exports.image = function(obj, base_path, field_name, file, del_file, callback) {
	if (del_file && obj[field_name]) {
		rimraf.sync(public_path + obj[field_name]);
		obj[field_name] = undefined;
		obj.poster_hover = undefined;
	}
	if (!file) return callback.call(null, null, obj);

	var dir_path = '/cdn/' + __app_name + '/images/' + base_path + '/' + obj._id;
	var file_name = field_name + '.' + mime.extension(file.mimetype);

	mkdirp(public_path + dir_path, function() {
		fs.rename(file.path, public_path + dir_path + '/' + file_name, function(err) {
			obj[field_name] = dir_path + '/' + file_name;
			callback.call(null, null, obj);
		});
	});

};