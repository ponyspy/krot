module.exports = function(Model) {
	var module = {};

	var User = Model.User;


	module.index = function(req, res, next) {
	  var Query = req.session.status == 'Admin'
	    ? User.find().sort('-date')
	    : User.find({'_id': req.session.user_id}).sort('-date');

	  Query.exec(function(err, users) {
	  	if (err) return next(err);

	    res.render('admin/users', {users: users});
	  });
	};


  return module;
};