var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var jsdom = require('jsdom');

var public_path = __glob_root + '/public';
var preview_path = __glob_root + '/public/preview/';

module.exports.image = function(obj, base_path, field_name, file, del_file, callback) {
	if (del_file && obj[field_name]) {
		rimraf.sync(public_path + obj[field_name]);
		obj[field_name] = undefined;
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

module.exports.image_article = function(article, post, callback) {
	var jquery = fs.readFileSync(__glob_root + '/public/libs/js/jquery-2.2.4.min.js', 'utf-8');
	var dir_name = '/cdn/' + __app_name + '/images/articles/' + article._id.toString() + '/content';

	rimraf(dir_name, { glob: true }, function(file_path) {
		jsdom.env(post.description, { src: [jquery] }, function(err, window) {
			var $ = window.$;
			var images = $('img').toArray();

			async.forEach(images, function(image, callback) {
				var $this = $(image);
				var file_name = path.basename($this.attr('src'));

				$this.removeAttr('class').removeAttr('width').removeAttr('height').removeAttr('alt');
				$this.attr('src', dir_name + '/' + file_name);

				mkdirp(public_path + dir_name, function() {
					fs.createReadStream(preview_path + file_name).pipe(fs.createWriteStream(public_path + dir_name + '/' + file_name));
					callback();
				});
			}, function() {
					article.description = $('body').html();
					callback(null, article);
			});
		});
	});
};


module.exports.image_article_preview = function(article, callback) {
	var jquery = fs.readFileSync(__glob_root + '/public/libs/js/jquery-2.2.4.min.js', 'utf-8');

	jsdom.env(article.description, { src: [jquery] }, function(err, window) {
		var $ = window.$;
		var images = $('img').toArray();

		async.forEach(images, function(image, callback) {
			var $this = $(image);

			var file_path = $this.attr('src');
			var file_name = path.basename(file_path);

			fs.createReadStream(public_path + file_path).pipe(fs.createWriteStream(preview_path + file_name));

			$this.attr('src', '/preview/' + file_name);

			callback();
		}, function() {
				article.description = $('body').html();
				callback(null, article);
		});
	});
};