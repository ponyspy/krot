module.exports = function(Model, Params) {
  var module = {};

  var User = Model.User;

  var validateEmail = Params.validateEmail;


  module.index = function(req, res, next) {
    var id = req.params.id;

    User.findById(id).exec(function(err, user) {
      if (err) return next(err);

      res.render('admin/users/edit.jade', {user: user});
    });
  };


  module.form = function(req, res, next) {
    var post = req.body;
    var id = req.params.id;

    if (!post.login || !post.email) return res.redirect('back');
    if (!validateEmail(post.email)) return res.redirect('back');

    User.findById(id).exec(function(err, user) {
      if (err) return next(err);

      user.login = post.login;
      if (post.password !== '') {
        user.password = post.password;
      }
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