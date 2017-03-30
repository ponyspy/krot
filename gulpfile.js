var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var pump = require('pump');

var gulp = require('gulp'),
		util = require('gulp-util'),
		changed = require('gulp-changed'),
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


// Decorators Block


var _ = function(flags, description, task) {
	task.description = description;
	task.flags = {};

	if (flags && flags.length) flags.forEach(function(flag) {
		if (flag == 'prod') task.flags['-p --prod'] = 'Builds in ' + util.colors.underline.green('production') + ' mode (minification, etc).';
		if (flag == 'dev') task.flags['-d --dev'] = 'Builds in ' + util.colors.underline.yellow('development') + ' mode (default).';
		if (flag == 'lint') task.flags['-l --lint']	= 'Lint JavaScript code.';
		if (flag == 'maps') task.flags['-m --maps']	= 'Generate sourcemaps files.';
	});

	return task;
};


// Loggers Block


util.log([
	'Lint ',
	(Lint ? util.colors.green('enabled') : util.colors.red('disabled')),
	', sourcemaps ',
	(Maps ? util.colors.green('enabled') : util.colors.yellow('disabled')),
	', build in ',
	(Prod ? util.colors.underline.green('production') : util.colors.underline.yellow('development')),
	' mode.',
].join(''));

var error_logger = function(err) {
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

var watch_logger = function(event) {
	util.log([
		'File ',
		util.colors.green(event.path.replace(__dirname + '/', '')),
		' was ',
		util.colors.yellow(event.type),
		', running tasks...'
	].join(''));
};


// Paths Block


var paths = {
	stylus: {
		src: 'apps/**/src/styl/*.styl',
		dest: 'public/build/css'
	},
	scripts: {
		src: 'apps/**/src/js/*.js',
		dest: 'public/build/js'
	},
	stuff: {
		src: 'apps/**/stuff/**',
		dest: 'public/stuff'
	},
	clean: '{' + 'public/build/**' + ',' + 'public/stuff/**' + '}'
};


// Tasks Block


gulp.task('clean', _(null, 'Delete dest folder', function(callback) {
	return rimraf(paths.clean, callback);
}));

gulp.task('build:stuff', _(null, 'Build Stuff files', function() {
	return pump([
		gulp.src(paths.stuff.src),
			changed(paths.stuff.dest),
			rename(function(path) { path.dirname = path.dirname.replace('/stuff', ''); }),
		gulp.dest(paths.stuff.dest)
	], error_logger);
}));

gulp.task('build:stylus', _(['prod', 'dev', 'maps'], 'Build Stylus', function() {
	return pump([
		gulp.src(paths.stylus.src),
			changed(paths.stylus.dest),
			Maps ? sourcemaps.init({ loadMaps: true }) : util.noop(),
			stylus({ compress: Prod }),
			autoprefixer({
				browsers: ['last 2 versions'],
				cascade: !Prod
			}),
			Maps ? sourcemaps.write('.') : util.noop(),
			rename(function(path) { path.dirname = path.dirname.replace('/src/styl', ''); }),
		gulp.dest(paths.stylus.dest)
	], error_logger);
}));

gulp.task('build:scripts', _(['prod', 'dev', 'lint', 'maps'], 'Build JavaScript', function() {
	return pump([
		gulp.src(paths.scripts.src),
			changed(paths.scripts.dest),
			Lint ? jshint({ laxbreak: true, expr: true, '-W041': false }) : util.noop(),
			Lint ? jshint.reporter('jshint-stylish') : util.noop(),
			Maps ? sourcemaps.init({ loadMaps: true }) : util.noop(),
			Prod ? uglify() : util.noop(),
			Maps ? sourcemaps.write('.', { mapSources: function(path) { return path.split('/').slice(-1)[0]; } }) : util.noop(),
			rename(function(path) { path.dirname = path.dirname.replace('/src/js', ''); }),
		gulp.dest(paths.scripts.dest)
	], error_logger);
}));

gulp.task('watch', _(null, 'Watch files and build on change', function() {
	gulp.watch(paths.scripts.src, ['build:scripts']).on('change', watch_logger);
	gulp.watch(paths.stylus.src, ['build:stylus']).on('change', watch_logger);
	gulp.watch(paths.stuff.src, ['build:stuff']).on('change', watch_logger);
}));


// Run Tasks Block


gulp.task('build', _(null, 'Build all...', function(callback) {
	runSequence('clean', ['build:stylus', 'build:scripts', 'build:stuff'], callback);
}));

gulp.task('default', _(null, 'Build and start watching', function(callback) {
	runSequence('clean', ['build:stylus', 'build:scripts', 'build:stuff'], 'watch', callback);
}));