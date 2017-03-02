var mongoose = require('mongoose'),
		mongooseBcrypt = require('mongoose-bcrypt');

var Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

mongoose.Promise = Promise;
mongoose.connect('localhost', __app_name);


// ------------------------
// *** Getters Block ***
// ------------------------


var cdnPath = function(val) {
	return '/cdn/' + __app_name + '/' + val;
};


// ------------------------
// *** Schema Block ***
// ------------------------


var userSchema = new Schema({
	login: String,
	password: String,
	email: String,
	status: String,
	date: { type: Date, default: Date.now },
});

var issueSchema = new Schema({
	numb: { type: Number, index: true, unique: true },
	logo: { type: String, get: cdnPath },
	background: { type: String, get: cdnPath },
	style: {
		background: {
			position: String,
			size: String,
			attachment: String,
			repeat: String
		}
	},
	columns: [{
		main: Boolean,
		articles: [{ type: ObjectId, ref: 'Article' }]
	}],
	status: String,	// hidden
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now, index: true },
});

var articleSchema = new Schema({
	title: { type: String, trim: true },
	intro: { type: String, trim: true },
	description: { type: String, trim: true },
	cover: { type: String, get: cdnPath },
	base: { type: String, get: cdnPath },
	hover: { type: String, get: cdnPath },
	files: [{
		path: { type: String, get: cdnPath },
		desc: String
	}],
	categorys: [{ type: ObjectId, ref: 'Category' }],
	status: String,	// hidden
	sym: { type: String, trim: true, index: true, unique: true, sparse: true },
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now, index: true },
}, { toJSON: { getters: true }, toObject: { getters: true } });

var categorySchema = new Schema({
	title: { type: String, trim: true },
	description: { type: String, trim: true },
	type: String, // theme, country, author
	status: String,	// hidden
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now, index: true },
});


// ------------------------
// *** Index Block ***
// ------------------------


articleSchema.index({'title': 'text', 'intro': 'text', 'description': 'text'}, { default_language: 'russian', weights: { title: 3, intro: 2, description: 1 } });
categorySchema.index({'title': 'text', 'description': 'text'}, { default_language: 'russian', weights: { title: 2, description: 1 } });


// ------------------------
// *** Plugins Block ***
// ------------------------


userSchema.plugin(mongooseBcrypt, { fields: ['password'] });


// ------------------------
// *** Exports Block ***
// ------------------------


module.exports.User = mongoose.model('User', userSchema);
module.exports.Article = mongoose.model('Article', articleSchema);
module.exports.Category = mongoose.model('Category', categorySchema);
module.exports.Issue = mongoose.model('Issue', issueSchema);