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

module.exports.image = function(obj, base_path, field_name, file_size, file, del_file, callback) {

	if (del_file && obj[field_name]) {
		rimraf.sync(public_path + obj[field_name].replace(/jpg|png/, '*'), { glob: true });
		obj[field_name] = undefined;
	}

	if (del_file || !file) return callback.call(null, null, obj);

	var dir_path = '/cdn/' + __app_name + '/images/' + base_path + '/' + obj._id;

	rimraf(public_path + dir_path + '/' + field_name + '.*', { glob: true }, function() {
		mkdirp(public_path + dir_path, function() {
			gm(file.path).identify({ bufferStream: true }, function(err, meta) {
				var file_name = field_name + '.' + (meta['Channel depth'].Alpha ? 'png' : 'jpg');

				this.resize(meta.size.width > file_size ? file_size : false, false);
				this.quality(meta.size.width >= file_size ? 82 : 100);
				this.write(public_path + dir_path + '/' + file_name, function(err) {
					obj[field_name] = dir_path + '/' + file_name;
					callback.call(null, null, obj);
				});
			});
		});
	});
};

module.exports.image_article = function(article, post, callback) {
	var jquery = fs.readFileSync(__glob_root + '/public/libs/js/jquery-2.2.4.min.js', 'utf-8');
	var dir_path = '/cdn/' + __app_name + '/images/articles/' + article._id.toString() + '/content';

	rimraf(dir_path, { glob: true }, function(file_path) {
		jsdom.env(post.description, { src: [jquery] }, function(err, window) {
			var $ = window.$;
			var images = $('img').toArray();

			async.forEach(images, function(image, callback) {
				var $this = $(image);
				var file_name = path.basename($this.attr('src'));

				$this.removeAttr('width').removeAttr('height').removeAttr('alt');
				$this.attr('src', dir_path + '/' + file_name);

				mkdirp(public_path + dir_path, function() {
					fs.createReadStream(preview_path + file_name).pipe(fs.createWriteStream(public_path + dir_path + '/' + file_name));
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

module.exports.files_article_upload = function(article, post, files, callback) {
	if (files.attach && files.attach.length > 0) {
		async.forEachOfSeries(files.attach, function(file, i, callback) {
			var dir_path = '/cdn/' + __app_name + '/files/articles/' + article._id;
			var file_name = Date.now() + '.' + mime.extension(file.mimetype);

			mkdirp(public_path + dir_path, function() {
				fs.rename(file.path, public_path + dir_path + '/' + file_name, function() {
					article.files.push({
						path: dir_path + '/' + file_name,
						desc: post.attach_desc[i] || ''
					});
					callback();
				});
			});
		}, function() {
			callback(null, 'files_upload');
		});
	} else {
		callback(null, false);
	}
};

module.exports.files_article_delete = function(article, post, files, callback) {
	if (post.files_delete && post.files_delete.length > 0) {
		async.eachSeries(post.files_delete, function(path, callback) {
			rimraf(public_path + path, { glob: false }, function() {
				var num = article.files.map(function(e) { return e.path; }).indexOf(path);
				article.files.splice(num, 1);
				article.markModified('files');
				callback();
			});
		}, function() {
			callback(null, 'files_delete');
		});
	} else {
		callback(null, false);
	}
};