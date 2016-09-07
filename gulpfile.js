(function () {
	const gulp = require('gulp');	//gulp模块
	const fs = require('fs');	//json文件模块
	const del = require('del');	//清空目录
	const babel = require('gulp-babel');	//编译es6
	const uglify = require('gulp-uglify');	//压缩js
	const rename = require('gulp-rename');	//重命名文件
	const cssnano = require('gulp-cssnano');	//压缩css文件
	const concat = require('gulp-concat');	//合并文件
	const runSequence = require('run-sequence');	//合并任务执行
	const browserify = require('browserify');	//让你使用类似于 node 的 require() 的方式来组织浏览器端的 Javascript 代码
	const source = require('vinyl-source-stream');	//将Browserify的bundle()的输出转换为Gulp可用的vinyl（一种虚拟文件格式）流
	const sass = require('gulp-sass');	//编译sass
	const browserSync = require('browser-sync').create();	//自动刷新
	const assets = JSON.parse(fs.readFileSync('assets.json'));	//文件配置
	
	//执行任务
	gulp.task('default', (callback) => {
		return runSequence(['clean'], ['build'], ['serve', 'watch'], callback);
	});
	
	gulp.task('build', (callback) => {
	    return runSequence(
	    	['assetsJs', 'assetsCss'],
	    	['convertJS', 'sassfile', 'copyHtml', 'copyImg'],
	    	callback
	    );
	});
		
	//清空目录
	gulp.task('clean', (callback) => {
	    return del(['./dist/'], callback);
	});
	
	//打包并压缩通用的JS文件
	gulp.task('assetsJs', () => {
	    return gulp.src(assets.assetsJs).pipe(concat('assets.js', {
	      newLine: ';\n'
	    })).pipe(uglify()).pipe(gulp.dest('./dist/assets/js/'));
	});
	
	//打包并压缩通用的CSS文件
	gulp.task('assetsCss', () => {
	    return gulp.src(assets.assetsCss).pipe(concat('assets.css', {
	      newLine: '\n\n'
	    })).pipe(cssnano()).pipe(gulp.dest('./dist/assets/css/'));
	});
	
	// 编译并压缩js
	gulp.task('convertJS', () => {
		return gulp.src(assets.appJs).pipe(babel({
	      	presets: ['es2015']
	    })).pipe(uglify()).pipe(gulp.dest('./dist/script/'));
	});
	
	// 编译并压缩scss
	gulp.task('sassfile', () => {
	    return gulp.src(assets.appScss)
	    .pipe(sass({outputStyle: 'compressed'})).pipe(gulp.dest('./dist/style/'));
	});
	
	//拷贝html文件
	gulp.task('copyHtml', () => {
	    return gulp.src(['./src/**/*.html']).pipe(gulp.dest('./dist/'));
	});
	
	//拷贝img文件
	gulp.task('copyImg', () => {
	    return gulp.src(['./src/images/**/*.png', './src/images/**/*.jpg', './src/images/**/*.gif']).pipe(gulp.dest('./dist/images'));
	});
	
	//配置访问前端文件服务器
	gulp.task('serve', () => {
	    return browserSync.init({
		    server: {
		        baseDir: './dist/'
	    	},
	    	port: 7412
	    });
	});
	
	//配置当文件有所改动，页面自动刷新
	gulp.task('watch', () => {
	    return gulp.watch('./src/**/*.*', ['reload']);
	});
	  
	gulp.task('reload', (callback) => {
	    return runSequence(['build'], ['reload-browser'], callback);
	});
	  
	gulp.task('reload-browser', () => {
	    return browserSync.reload();
	});
	
}).call(this);
