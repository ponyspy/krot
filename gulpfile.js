var rimraf = require('rimraf'),
		pump = require('pump'),
		colors = require('ansi-colors'),
		argv = require('minimist')(process.argv.slice(2)),
		log = require('fancy-log');

var gulp = require('gulp'),
		noop = require('gulp-noop'),
		changed = require('gulp-changed'),
		cache = require('gulp-cached'),
		progeny = require('gulp-progeny'),
		filter = require('gulp-filter'),
		rename = require('gulp-rename'),
		sourcemaps = require('gulp-sourcemaps'),
		stylus = require('gulp-stylus'),
		autoprefixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),
		jshint = require('gulp-jshint');


// ENV Block


var Prod = argv.p || argv.prod;
var Lint = argv.l || argv.lint;
var Maps = argv.m || argv.maps;
var Force = argv.f || argv.force;
var Reset = argv.reset;

if (!Force && !Reset) log([
	'Lint ',
	(Lint ? colors.green('enabled') : colors.red('disabled')),
	', sourcemaps ',
	(Maps ? colors.green('enabled') : colors.yellow('disabled')),
	', build in ',
	(Prod ? colors.underline.green('production') : colors.underline.yellow('development')),
	' mode.',
].join(''));


// Flags Block


var build_flags = {
	'-p --prod': 'Builds in ' + colors.underline.green('production') + ' mode (minification, etc).',
	'-d --dev': 'Builds in ' + colors.underline.yellow('development') + ' mode (default).',
	'-l --lint': 'Lint JavaScript code.',
	'-m --maps': 'Generate sourcemaps files.'
};

var clean_flags = {
	'-f --force': 'Force clean public data.',
	'--reset': 'Reset project to initial state.'
};


// Handlers Block


var errorLogger = function(err) {
	if (err) log([
		'',
		colors.bold.inverse.red('---------- ERROR MESSAGE START ----------'),
		'',
		(colors.red(err.name) + ' in ' + colors.yellow(err.plugin)),
		'',
		err.message,
		colors.bold.inverse.red('----------- ERROR MESSAGE END -----------'),
		''
	].join('\n'));
};

var watchLogger = function(e_type) {
	return function(path, stats) {
		log([
			'File ',
			colors.green(path.replace(__dirname + '/', '')),
			' was ',
			colors.yellow(e_type),
			', running tasks...'
		].join(''));
	};
};

var cacheClean = function(path) {
	delete cache.caches.scripts[path];
	delete cache.caches.styles[path];
};


// Paths Block


var paths = {
	styles: {
		src: 'apps/**/src/styl/**/*.styl',
		dest: 'public/build'
	},
	scripts: {
		src: 'apps/**/src/js/**/*.js',
		dest: 'public/build'
	},
	stuff: {
		src: 'apps/**/stuff/**',
		dest: 'public/stuff'
	},
	clean: {
		base: ['public/build/**', 'public/stuff/**'],
		force: ['public/preview/**/*', 'uploads/**/*'],
		reset: ['node_modules/**', 'public/cdn/**']
	}
};


// Tasks Block


function clean(callback) {
	var clean = paths.clean.base;

	if (Force) clean = clean.concat(paths.clean.force);
	if (Reset) clean = [].concat(paths.clean.base, paths.clean.force, paths.clean.reset);

	return rimraf('{' + clean.join(',') + '}', callback);
}

function stuff() {
	return pump([
		gulp.src(paths.stuff.src),
			changed(paths.stuff.dest),
			rename(function(path) { path.dirname = path.dirname.replace('/stuff', ''); }),
		gulp.dest(paths.stuff.dest)
	], errorLogger);
}

function styles() {
	return pump([
		gulp.src(paths.styles.src),
			cache('styles'),
			progeny(),
			filter(['**/*.styl', '!**/_*.styl']),
			Maps ? sourcemaps.init({ loadMaps: true }) : noop(),
			stylus({ compress: Prod }),
			autoprefixer({
				overrideBrowserslist: ['last 12 versions'],
				cascade: !Prod
			}),
			Maps ? sourcemaps.write('.') : noop(),
			rename(function(path) { path.dirname = path.dirname.replace('/src/styl', '/css'); }),
		gulp.dest(paths.styles.dest)
	], errorLogger);
}

function scripts() {
	return pump([
		gulp.src(paths.scripts.src),
			cache('scripts'),
			Lint ? jshint({ laxbreak: true, expr: true, '-W041': false }) : noop(),
			Lint ? jshint.reporter('jshint-stylish') : noop(),
			Maps ? sourcemaps.init({ loadMaps: true }) : noop(),
			Prod ? uglify() : noop(),
			Maps ? sourcemaps.write('.', { mapSources: function(path) { return path.split('/').slice(-1)[0]; } }) : noop(),
			rename(function(path) { path.dirname = path.dirname.replace('/src/js', '/js'); }),
		gulp.dest(paths.scripts.dest)
	], errorLogger);
}

function watch() {
	gulp.watch(paths.scripts.src, scripts)
			.on('unlink', cacheClean)
			.on('change', watchLogger('changed'))
			.on('add', watchLogger('added'))
			.on('unlink', watchLogger('removed'));

	gulp.watch(paths.styles.src, styles)
			.on('unlink', cacheClean)
			.on('change', watchLogger('changed'))
			.on('add', watchLogger('added'))
			.on('unlink', watchLogger('removed'));

	gulp.watch(paths.stuff.src, stuff)
			.on('change', watchLogger('changed'))
			.on('add', watchLogger('added'))
			.on('unlink', watchLogger('removed'));
}


// Exports Block


var task_clean = clean;
		clean.description = 'Clean project folders';
		clean.flags = clean_flags;

var task_build = gulp.series(clean, gulp.parallel(styles, scripts, stuff));
		task_build.description = 'Build all...';
		task_build.flags = build_flags;

var task_default = gulp.series(clean, gulp.parallel(styles, scripts, stuff), watch);
		task_default.description = 'Build and start watching';
		task_default.flags = build_flags;


exports.build = task_build;
exports.default = task_default;
exports.clean = task_clean;