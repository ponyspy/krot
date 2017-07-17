var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var issues = {
	index: require('./index.js')(Model),
	issue: require('./issue.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(issues.index.index);

	router.route('/:issue_id')
		.get(issues.issue.index);

	return router;
})();