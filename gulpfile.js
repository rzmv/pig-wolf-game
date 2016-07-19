// Starts a test server, which you can view at http://localhost:8000
var gulp = require('gulp');
var webserver = require('gulp-webserver');
  
gulp.task('server', function() { 
    gulp.src('./')
    .pipe(webserver({
        port: 8000,
        host: 'localhost',
        fallback: 'index.html',
        livereload: true,
        open: true
    }));
});
