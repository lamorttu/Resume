var gulp = require('gulp');
var webserver = require('gulp-webserver');
var url = require('url');
var fs = require('fs');
var sass = require('gulp-sass');
var minifycss  = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var webpack = require('gulp-webpack');
var named = require('vinyl-named');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var watch = require('gulp-watch');
var sequence = require('gulp-watch-sequence');
var minifyHTML = require('gulp-minify-html');

gulp.task('webserver',function(){
	gulp.src('www')
	.pipe(webserver({
		livereload: true,
		open:true,

		middleware:function(req,res,next){
			var urlObj = url.parse(req.url,true),
			method = req.method;

			switch(urlObj.pathname){
				case '/api/skill.php':
				res.setHeader('Content-Type','application/json');
				fs.readFile('mock/skill.json','utf-8',function(err,data){
					res.end(data);
				});
				return;
				case '/api/project.php':
				res.setHeader('Content-Type','application/json');
				fs.readFile('mock/project.json','utf-8',function(err,data){
					res.end(data);
				});
				return;
				case '/api/work.php':
				res.setHeader('Content-Type','application/json');
				fs.readFile('mock/work.json','utf-8',function(err,data){
					res.end(data);
				});
				return;
				case '/api/me.php':
				res.setHeader('Content-Type','application/json');
				fs.readFile('mock/me.json','utf-8',function(err,data){
					res.end(data);
				});
				return;
				default:;
			}
			next();
		}
	}))
});

gulp.task('copy-index',function(){
	return gulp.src('./src/index.html')
	.pipe(gulp.dest('./www'));
});

gulp.task('copy-images',function(){
	return gulp.src('./src/images/**')
	.pipe(gulp.dest('./www/images'));
});

gulp.task('copy-resources',function(){
	return gulp.src('./src/resources/**')
	.pipe(gulp.dest('./www/resources'));
});

gulp.task('sass',function(){
	return gulp.src('./src/css/**/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('./www/css'));
});

gulp.task('packjs',function(){
	return gulp.src('./src/js/index.js')
	.pipe(named())
	.pipe(webpack())
	.pipe(uglify())
	.pipe(gulp.dest('./www/js'));
});

gulp.task('vercss',function(){
	return gulp.src('./www/css/index.css')
	.pipe(rev())
	.pipe(gulp.dest('./www/css'))
	.pipe(rev.manifest())
	.pipe(gulp.dest('./www/ver/css'));
});

gulp.task('verjs',function(){
	return gulp.src('./www/js/index.js')
	.pipe(rev())
	.pipe(gulp.dest('./www/js'))
	.pipe(rev.manifest())
	.pipe(gulp.dest('./www/ver/js'));
});

gulp.task('html',function(){
	return gulp.src(['./www/ver/**/*.json','./www/*.html'])
	.pipe(revCollector({replaceReved:true}))
	.pipe(gulp.dest('./www/'))
});

gulp.task('watch',function(){
	gulp.watch('./src/index.html',['copy-index']);
	gulp.watch('./src/resources/**',['copy-resources']);
	gulp.watch('./src/images/**',['copy-images']);
	watch('./src/images/**',function(){
		gulp.start('copy-images');
	})
	gulp.watch('./src/css/**',['sass']);
	var queue = sequence(300);
	watch('./src/js/**/*.js',{
		name:'JS',
		emitOnGlob:false
	},queue.getHandler('packjs','verjs','html'));
	watch('./src/css/**/*.scss',{
		name:'CSS',
		emitOnGlob:false
	},queue.getHandler('sass','vercss','html'));
});

gulp.task('default',['webserver','watch']);