var rimraf = require('rimraf');
var fs = require('fs');
var exec = require('child_process').exec;

module.exports = function(Model) {
	var module = {};

	var Mirror = Model.Mirror;


	module.mirrors_apply = function(req, res) {
		Mirror.find().sort('-date').exec(function(err, mirrors) {

			if (err || !mirrors || mirrors.length == 0) {
				rimraf(__glob_root + '/out.conf', function() { // /etc/nginx/vhosts/mirrors.conf
					exec('ls', function(err, stdout, stderr) { // systemctl restart nginx
						res.send('fail');
					});
				});
			} else {
				fs.readFile(__glob_root + '/mirrors_tmpl.conf', 'utf8', function(err, data) {
					if (err) throw err;

					var domains = mirrors.map(function(m) { return m.name; });
					var www = domains.map(function(m) { return 'www.' + m; });

					data = data.replace(/@mirrors@/g, domains.join(' '));
					data = data.replace(/@www_mirrors@/g, www.join(' '));

					fs.writeFile(__glob_root + '/out.conf', data, function(err) { // /etc/nginx/vhosts/mirrors.conf
						exec('ls', function(err, stdout, stderr) { // systemctl restart nginx
							res.send('ok');
						});
					});
				});
			}
		});
	};


	return module;
};