const
    fs = require('fs'),
    http = require('http'),
    mime = require('./mime.json');

http.createServer(function(req, res) {
    function wrap(err, data, call) {
        if (err)
            res.end(JSON.stringify(err));
        else if (call)
            call(data);
    }

    if ('/' == req.url)
        req.url = '/index.html';
    var file = req.url.slice(1);
    switch (req.method) {
        default:
            var type = /\.(\w+)$/.exec(file);
            if (type && (type = mime[type[1]]))
                res.setHeader('Content-Type', type);
            fs.createReadStream(file, {flags:'r', autoClose:true})
                .on('error', function(err) {
                    res.setHeader('Content-Type', 'application/json');
                    switch (err.code) {
                        case 'ENOENT':
                            res.writeHead(404);
                            break;
                        case 'EACCES':
                            res.writeHead(403);
                            break;
                    }
                   res.end(JSON.stringify(err));
                })
                .pipe(res);
            break;

        case 'POST':
            console.log(req.headers['content-length']);
            var w = fs.createWriteStream(file, {flags:'w'});
            req.pipe(w);
            w.on('close', function() {
//                res.writeHead(302, {
//                    Location: file
//                });
                res.end();
            });
            break;
    }
})
.listen(8080);
