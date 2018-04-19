module.exports = function(Model, Params) {
	var module = {};

	var User = Model.User;

	var msg = Params.msg;
	var validateEmail = Params.validateEmail;
	var validatePassword = Params.validatePassword;

	module.index = function(req, res) {
		req.session.user_id
			? res.redirect('/auth')
			: res.render('auth/registr.pug');
	};


	module.form = function(req, res, next) {
		var post = req.body;

		if (!post.login || !post.password || !post.email) return res.redirect('/auth/registr' + msg('Все поля должны быть заполнены!'));
		if (!validateEmail(post.email)) return res.redirect('/auth/registr' + msg('Неправильный формат Email!'));
		if (!validatePassword(post.password)) return res.redirect('/auth/registr' + msg('Пароль должен содержать минимум 8 символов, хотя бы одну цифру, одну заглавную букву и не содержать символов пробела.'));

		User.findOne({ $or: [ {'login': post.login}, {'email': post.email} ] }).exec(function(err, person) {
			if (err) return next('err');
			if (person) return res.redirect('/auth/registr' + msg('Пользователь с таким логином или Email уже существует!'));

			var user = new User({
				login: post.login,
				password: post.password,
				email: post.email
			});

			user.save(function(err, user) {
				if (err) return next('err');

				res.redirect('/auth/login' + msg('Пользователь зарегистрирован! Свяжитесь с администратором для получения прав доступа!'));
			});
		});
	};


	return module;
};