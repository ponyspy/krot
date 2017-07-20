var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var pump = require('pump');

var gulp = require('gulp'),
		util = require('gulp-util'),
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


var Prod = util.env.p || util.env.prod;
var Lint = util.env.l || util.env.lint;
var Maps = util.env.m || util.env.maps;
var Force = util.env.f || util.env.force;
var Reset = util.env.reset;

if (!Force && !Reset) util.log([
	'Lint ',
	(Lint ? util.colors.green('enabled') : util.colors.red('disabled')),
	', sourcemaps ',
	(Maps ? util.colors.green('enabled') : util.colors.yellow('disabled')),
	', build in ',
	(Prod ? util.colors.underline.green('production') : util.colors.underline.yellow('development')),
	' mode.',
].join(''));


// Decorators Block


var _ = function(flags, description, task) {
	task.description = description;
	task.flags = {};

	if (flags && flags.length) flags.forEach(function(flag) {
		if (flag == 'prod') task.flags['-p --prod'] = 'Builds in ' + util.colors.underline.green('production') + ' mode (minification, etc).';
		if (flag == 'dev') task.flags['-d --dev'] = 'Builds in ' + util.colors.underline.yellow('development') + ' mode (default).';
		if (flag == 'lint') task.flags['-l --lint']	= 'Lint JavaScript code.';
		if (flag == 'maps') task.flags['-m --maps']	= 'Generate sourcemaps files.';
		if (flag == 'force') task.flags['-f --force']	= 'Force clean public data.';
		if (flag == 'reset') task.flags['--reset']	= 'Reset project to initial state.';
	});

	return task;
};


// Handlers Block


var errorLogger = function(err) {
	if (err) util.log([
		'',
		util.colors.bold.inverse.red('---------- ERROR MESSAGE START ----------'),
		'',
		(util.colors.red(err.name) + ' in ' + util.colors.yellow(err.plugin)),
		'',
		err.message,
		util.colors.bold.inverse.red('----------- ERROR MESSAGE END -----------'),
		''
	].join('\n'));
};

var watchLogger = function(event) {
	util.log([
		'File ',
		util.colors.green(event.path.replace(__dirname + '/', '')),
		' was ',
		util.colors.yellow(event.type),
		', running tasks...'
	].join(''));
};

var cacheClean = function(event) {
	if (event.type === 'deleted') {
		delete cache.caches.scripts[event.path];
		delete cache.caches.stylus[event.path];
	}
};


// Paths Block


var paths = {
	stylus: {
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


gulp.task('clean', _(['force', 'reset'], 'Clean project folders', function(callback) {
	var clean = paths.clean.base;

	if (Force) clean = clean.concat(paths.clean.force);
	if (Reset) clean = [].concat(paths.clean.base, paths.clean.force, paths.clean.reset);

	return rimraf('{' + clean.join(',') + '}', callback);
}));

gulp.task('build:stuff', _(null, 'Build Stuff files', function() {
	return pump([
		gulp.src(paths.stuff.src),
			changed(paths.stuff.dest),
			rename(function(path) { path.dirname = path.dirname.replace('/stuff', ''); }),
		gulp.dest(paths.stuff.dest)
	], errorLogger);
}));

gulp.task('build:stylus', _(['prod', 'dev', 'maps'], 'Build Stylus', function() {
	return pump([
		gulp.src(paths.stylus.src),
			cache('stylus'),
			progeny(),
			filter(['**/*.styl', '!**/_*.styl']),
			Maps ? sourcemaps.init({ loadMaps: true }) : util.noop(),
			stylus({ compress: Prod }),
			autoprefixer({
				browsers: ['last 2 versions'],
				cascade: !Prod
			}),
			Maps ? sourcemaps.write('.') : util.noop(),
			rename(function(path) { path.dirname = path.dirname.replace('/src/styl', '/css'); }),
		gulp.dest(paths.stylus.dest)
	], errorLogger);
}));

gulp.task('build:scripts', _(['prod', 'dev', 'lint', 'maps'], 'Build JavaScript', function() {
	return pump([
		gulp.src(paths.scripts.src),
			cache('scripts'),
			Lint ? jshint({ laxbreak: true, expr: true, '-W041': false }) : util.noop(),
			Lint ? jshint.reporter('jshint-stylish') : util.noop(),
			Maps ? sourcemaps.init({ loadMaps: true }) : util.noop(),
			Prod ? uglify() : util.noop(),
			Maps ? sourcemaps.write('.', { mapSources: function(path) { return path.split('/').slice(-1)[0]; } }) : util.noop(),
			rename(function(path) { path.dirname = path.dirname.replace('/src/js', '/js'); }),
		gulp.dest(paths.scripts.dest)
	], errorLogger);
}));

gulp.task('watch', _(null, 'Watch files and build on change', function() {
	gulp.watch(paths.scripts.src, ['build:scripts']).on('change', cacheClean).on('change', watchLogger);
	gulp.watch(paths.stylus.src, ['build:stylus']).on('change', cacheClean).on('change', watchLogger);
	gulp.watch(paths.stuff.src, ['build:stuff']).on('change', watchLogger);
}));


// Run Tasks Block


gulp.task('build', _(null, 'Build all...', function(callback) {
	runSequence('clean', ['build:stylus', 'build:scripts', 'build:stuff'], callback);
}));

gulp.task('default', _(null, 'Build and start watching', function(callback) {
	runSequence('clean', ['build:stylus', 'build:scripts', 'build:stuff'], 'watch', callback);
}));