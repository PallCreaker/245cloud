// http://openweb.co.jp/2013/12/26/%E6%89%93%E5%80%92grunt%EF%BC%81node-js%E7%94%A8%E3%81%AE%E6%96%B0%E3%81%9F%E3%81%AA%E3%83%93%E3%83%AB%E3%83%89%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0gulp%E3%81%93%E3%81%A8%E3%81%AF%E3%81%98%E3%82%81/

var gulp = require('gulp')
, coffee = require('gulp-coffee')
;

// CoffeeScriptファイルをコンパイルする
gulp.task('coffee', function() {
    gulp.src('app/*.coffee')
        .pipe(coffee())
        .pipe(gulp.dest('public'));
});

// ファイルの変更を監視する
// CoffeeScriptとLessのファイルが変更されたら自動的にコンパイルする
gulp.task('watch', function() {
    gulp.watch('app/**', function(event) {
        gulp.run('coffee');
    });
});

// デフォルトタスク
gulp.task('default', function() {
    gulp.run('coffee');
});
