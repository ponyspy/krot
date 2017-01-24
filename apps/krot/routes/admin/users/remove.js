module.exports = function(Model) {
  var module = {};

  var User = Model.User;


	module.index = function(req, res) {
	  var id = req.body.id;

	  User.findByIdAndRemove(id, function(err) {
	  	if (err) return next(err);

	  	req.session.user_id == id
	  		? res.send('current_user')
	  		: res.send('ok');
	  });
	};


  return module;
};