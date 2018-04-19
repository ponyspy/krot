module.exports = function(Model, Params) {
	var module = {};

	var User = Model.User;

	var validateEmail = Params.validateEmail;
	var validatePassword = Params.validatePassword;


	module.index = function(req, res) {
		if (req.session.status == 'Admin') {
			res.render('admin/users/add.pug');
		} else {
			res.redirect('back');
		}
	};


	module.form = function(req, res, next) {
		var post = req.body;

		if (!post.login || !post.password || !post.email) return res.redirect('back');
		if (!validateEmail(post.email)) return res.redirect('back');
		if (!validatePassword(post.password)) return res.redirect('back');

		User.findOne({ $or: [ {'login': post.login}, {'email': post.email} ] }).exec(function(err, person) {
			if (err) return next('err');
			if (person) return res.redirect('back');

			var user = new User();

			user.login = post.login;
			user.password = post.password;
			user.email = post.email;
			user.status = post.status;

			user.save(function(err, user) {
				if (err) return next(err);

				res.redirect('/admin/users');
			});
		});
	};


	return module;
};