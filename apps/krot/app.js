global.__app_name = 'krot';
global.__glob_root = __dirname.replace('/apps/' + __app_name, '');
global.__app_root = __dirname;

var express = require('express'),
		bodyParser = require('body-parser'),
		cookieParser = require('cookie-parser'),
		session = require('express-session');

var app = express();
var MongoStore = require('connect-mongo')(session);

app.set('x-powered-by', false);
app.set('views', __app_root + '/views');
app.set('view engine', 'pug');


if (process.env.NODE_ENV != 'production') {
	app.use(express.static(__glob_root + '/public'));
	app.locals.pretty = true;
	app.set('json spaces', 2);
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(session({
	key: 'session',
	rolling: true,
	resave: false,
	saveUninitialized: false,
	secret: 'keyboard cat',
	store: new MongoStore({ url: 'mongodb://localhost/' + __app_name }),
	cookie: {
		path: '/',
		maxAge: 1000 * 60 * 60 * 12 // 12 hours
	}
}));


app.use(function(req, res, next) {
	res.locals.__app_name = __app_name;
	res.locals.session = req.session;
	res.locals.host = req.hostname;
	res.locals.url = req.originalUrl;
	next();
});


var admin = require('./routes/admin/_admin.js');
var main = require('./routes/main/_main.js');
var auth = require('./routes/auth/_auth.js');
var error = require('./routes/_error.js');


app.use('/', main);
app.use('/admin', admin);
app.use('/auth', auth);

app.use(error.err_500, error.err_404);


// ------------------------
// *** Connect server Block ***
// ------------------------


app.listen(process.env.PORT || 3000, (process.env.NODE_ENV == 'production' ? 'localhost' : undefined), function() {
	console.log('http://localhost:' + (process.env.PORT || 3000));
});