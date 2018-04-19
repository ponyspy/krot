module.exports = function(Model, Params) {
	var module = {};

	var User = Model.User;

	var msg = Params.msg;

	module.index = function(req, res) {
		req.session.user_id
			? res.redirect('/auth')
			: res.render('auth/login.pug');
	};


	module.form = function(req, res, next) {
		var post = req.body;

		if (!post.login || !post.password) return res.redirect('/auth/login' + msg('Не указан логин или пароль!'));

		User.findOne({ $or: [ {'login': post.login}, {'email': post.login} ] }).exec(function(err, person) {
			if (err) return next(err);
			if (!person) return res.redirect('/auth/login' + msg('Нет такого пользователя!'));

			person.verifyPassword(post.password, function(err, isMatch) {
				if (err) return next(err);

				if (isMatch) {
					if (!/User|Admin/.test(person.status)) return res.redirect('/auth/login' + msg('Статус пользователя не определен!'));

					req.session.user_id = person._id;
					req.session.status = person.status;
					req.session.login = person.login;
					res.redirect('/auth');
				} else {
					res.redirect('/auth/login' + msg('Неверный пароль!'));
				}
			});
		});
	};


	return module;
};