var mongoose = require('mongoose'),
		mongooseBcrypt = require('mongoose-bcrypt');

var Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/' +  __app_name);


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
	theme: { type: String, trim: true },
	description: { type: String, trim: true },
	logo: String,
	background: String,
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
	cover: String,
	base: String,
	hover: String,
	files: [{
		path: String,
		desc: String
	}],
	categorys: [{ type: ObjectId, ref: 'Category' }],
	status: String,	// hidden
	sym: { type: String, trim: true, index: true, unique: true, sparse: true },
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now, index: true },
});

var categorySchema = new Schema({
	title: { type: String, trim: true },
	description: { type: String, trim: true },
	type: String, // theme, country, author
	status: String,	// hidden
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now, index: true },
});

var linkSchema = new Schema({
	title: { type: String, trim: true, index: true },
	url: { type: String, trim: true },
	status: String,	// hidden
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now, index: true },
});


// ------------------------
// *** Index Block ***
// ------------------------


issueSchema.index({'theme': 'text', 'description': 'text'}, {
	default_language: 'russian', weights: { theme: 2, description: 1 }
});

articleSchema.index({'title': 'text', 'intro': 'text', 'description': 'text'}, {
	default_language: 'russian', weights: { title: 3, intro: 2, description: 1 }
});

categorySchema.index({'title': 'text', 'description': 'text'}, {
	default_language: 'russian', weights: { title: 2, description: 1 }
});

linkSchema.index({'title': 'text'}, {
	default_language: 'russian', weights: { title: 1 }
});


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
module.exports.Link = mongoose.model('Link', linkSchema);