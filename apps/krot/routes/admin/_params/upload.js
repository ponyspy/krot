var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var jsdom = require('jsdom');
var svgo = require('svgo');

var public_path = __glob_root + '/public';
var preview_path = __glob_root + '/public/preview/';

module.exports.image = function(obj, base_path, field_name, file_size, file, del_file, callback) {

	if (del_file && obj[field_name]) {
		rimraf.sync(public_path + obj[field_name].replace(/jpg|png/, '*'), { glob: true });
		obj[field_name] = undefined;
	}

	if (del_file || !file) return callback.call(null, null, obj);

	var file_path = '/cdn/' + base_path + '/' + obj._id + '/images';

	rimraf(public_path + file_path + '/' + field_name + '.*', { glob: true }, function() {
		mkdirp(public_path + file_path, function() {
			if (mime.extension(file.mimetype) == 'svg') {
				var SVGO = new svgo({ plugins: [{ convertShapeToPath: false }] });
				var file_name = field_name + '.svg';

				fs.readFile(file.path, function(err, data) {
					if (err) return callback.call(null, null, obj);

					SVGO.optimize(data, function(result) {
						fs.writeFile(public_path + file_path + '/' + file_name, result.data, function(err) {
							obj[field_name] = file_path + '/' + file_name;

							rimraf(file.path, { glob: false }, function() {
								callback.call(null, null, obj);
							});
						});
					});
				});
			} else if (/jpeg|png|gif/.test(mime.extension(file.mimetype))) {
				gm(file.path).identify({ bufferStream: true }, function(err, meta) {
					var file_name = mime.extension(file.mimetype) == 'gif'
						? field_name + '.gif'
						: field_name + '.' + ((meta['Channel depth'].Alpha || meta['Channel statistics'].Alpha || meta.Alpha) ? 'png' : 'jpg');

					this.resize(meta.size.width > file_size ? file_size : false, false);
					this.quality(meta.size.width >= file_size ? 82 : 100);
					this.write(public_path + file_path + '/' + file_name, function(err) {
						obj[field_name] = file_path + '/' + file_name;

						rimraf(file.path, { glob: false }, function() {
							callback.call(null, null, obj);
						});
					});
				});
			} else {
				callback.call(null, null, obj);
			}
		});
	});
};

module.exports.image_article = function(article, post, callback) {
	var jquery = fs.readFileSync(__glob_root + '/public/libs/js/jquery-2.2.4.min.js', 'utf-8');
	var file_path = '/articles/' + article._id.toString() + '/images/content';
	var cdn_path = '/cdn/' + __app_name + file_path;

	rimraf(cdn_path, { glob: true }, function(rm_path) {
		jsdom.env(post.description, { src: [jquery] }, function(err, window) {
			var $ = window.$;
			var images = $('img').toArray();

			async.forEach(images, function(image, callback) {
				var $this = $(image);
				var file_name = path.basename($this.attr('src'));

				$this.removeAttr('width').removeAttr('height').removeAttr('alt');
				$this.attr('src', '{CDN_PATH}' + file_path + '/' + file_name);

				mkdirp(public_path + cdn_path, function() {
					fs.createReadStream(preview_path + file_name).pipe(fs.createWriteStream(public_path + cdn_path + '/' + file_name));
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
	if (!article.description) return callback(null, article);

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

module.exports.files_upload = function(obj, base_path, field_name, post, files, callback) {
	if (files.attach && files.attach.length > 0) {
		async.forEachOfSeries(files.attach, function(file, i, callback) {
			var file_path = '/cdn/' + base_path + '/' + obj._id + '/files';
			var file_name = Date.now() + '.' + mime.extension(file.mimetype);

			mkdirp(public_path + file_path, function() {
				fs.rename(file.path, public_path + file_path + '/' + file_name, function() {
					var description = [];

					description.push({ lg: 'ru', value: post.attach_desc.ru[i] });
					if (post.attach_desc.en) {
						description.push({ lg: 'en', value: post.attach_desc.en[i] });
					}

					obj[field_name].push({
						path: file_path + '/' + file_name,
						description: description
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

module.exports.files_delete = function(obj, field_name, post, files, callback) {
	if (post.files_delete && post.files_delete.length > 0) {
		async.eachSeries(post.files_delete, function(path, callback) {
			rimraf(public_path + path, { glob: false }, function() {
				var num = obj[field_name].map(function(e) { return e.path; }).indexOf(path);
				obj[field_name].splice(num, 1);
				obj.markModified(field_name);
				callback();
			});
		}, function() {
			callback(null, 'files_delete');
		});
	} else {
		callback(null, false);
	}
};