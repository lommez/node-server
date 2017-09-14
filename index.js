var express = require('express');
var path = require('path');
var fs = require('fs');

var applicationPath;
var port = process.env.PORT || 3000;

process.argv.forEach(function (val, index, array) {
    if (val.indexOf('--app') > -1) {
        var values = val.split(' ');
        applicationPath = values[1];
    }

    if (val.indexOf('--port') > -1) {
        var values = val.split(' ');
        port = values[1];
    }
});

if (applicationPath == undefined || !fs.existsSync(applicationPath)) {
    console.log('Application path doesn´t exists or the argument is invalid.');
    return;
}

var app = express();
var staticRoot = applicationPath + '/';
app.set('port', port);
app.use(express.static(staticRoot));

app.use(function (req, res, next) {    
    var accept = req.accepts('html', 'json', 'xml');
    if (accept !== 'html') {
        return next();
    }
    
    var ext = path.extname(req.path);
    if (ext !== '') {
        return next();
    }
    fs.createReadStream(staticRoot + 'index.html').pipe(res);
});

app.listen(app.get('port'), function () {
    console.log('app running on port', app.get('port'));
});