var rimraf = require('rimraf');
var fs = require('fs');
var exec = require('child_process').exec;

module.exports = function(Model) {
	var module = {};

	var Mirror = Model.Mirror;


	module.mirrors_apply = function(req, res) {
		var conf_path = process.env.NODE_ENV == 'production' ? '/etc/nginx/vhosts/mirrors.conf' : __glob_root + '/test.conf';
		var run_cmd = process.env.NODE_ENV == 'production' ? 'systemctl restart nginx' : 'ls';

		Mirror.find().where('status').ne('hidden').sort('-date').exec(function(err, mirrors) {
			if (err || !mirrors || mirrors.length == 0) {
				rimraf(conf_path, function() {
					exec(run_cmd, function(err, stdout, stderr) {
						res.send('fail');
					});
				});
			} else {
				fs.readFile(__glob_root + '/m_tmpl.conf', 'utf8', function(err, data) {
					if (err) throw err;

					var domains = mirrors.map(function(m) { return m.name; });
					var www = domains.map(function(m) { return 'www.' + m; });

					data = data.replace(/@mirrors@/g, domains.join(' '));
					data = data.replace(/@www_mirrors@/g, www.join(' '));

					fs.writeFile(conf_path, data, function(err) {
						exec(run_cmd, function(err, stdout, stderr) {
							res.send('ok');
						});
					});
				});
			}
		});
	};


	return module;
};