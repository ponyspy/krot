module.exports = function() {
	var module = {};


	module.index = function(req, res) {
		req.session.destroy();
		res.clearCookie('session');
		res.redirect('/auth');
	};


	return module;
};