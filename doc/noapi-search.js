const
    filewalker = require('filewalker'),
    fs = require('fs'),
    path = require('path');

var options = {};
options['matchRegExp'] = /\.py$/;

var lines = [];
var tmpl = fs.readFileSync('noapi.html').toString('utf8');
var last = 0;
filewalker(process.argv[2], options)
    .on('file', function(p, s) {
        if (p.search(/(api|alembic)\//) == 0)
            return;
        var matches = [];
        s = fs.readFileSync(path.join(process.argv[2], p)).toString('utf8');
        s = s.split('\n');
        for(var i in s) {
            if (s[i].search(/(db\.|dbget\()/) >=0) {
                var clazz, method;
                for(var j = i-1; j>=0; j--) {
                    var l = s[j];
                    if (!method && (method = l.match(/def\s+(\w+)/))) {
                        method = method[1];
                        if (method[0] == l[0])
                            break;
                    }
                    else if (clazz = l.match(/class\s+(\w+)/)) {
                        clazz = clazz[1];
                        break;
                    }
                }
                var match = '\t\t\t<tr><td>';
                match += i + '</td><td>';
                if (clazz)
                    method = clazz + '.' + method;
                match += method;
                match += '</td></tr>';
                matches.push(match);
                clazz = null;
                method = null;
            }
        }

        if (matches.length) {
            matches.unshift('\t\t<table>');
            matches.unshift('\t<dd>');
            matches.unshift('\t<dt>' + p + '</dt>');
            matches.push('\t\t</table>');
            matches.push('\t</dd>');
            console.log(p + '\t' + matches.length);
            matches = matches.join('\n');
            lines.push(matches);
        }
    })
    .on('error', function(err) {
        console.error(err);
    })
    .on('done', function() {
        lines = lines.join('\n');
        var dl = '<dl>';
        var start = tmpl.search(dl) + dl.length;
        var end = tmpl.search('</dl>');
        tmpl = tmpl.slice(0, start) + '\n' + '\n' + lines + tmpl.slice(end, tmpl.length);
        fs.writeFileSync('noapi.gen.html', tmpl);
        console.log('\n%d dirs, %d files, %d bytes', this.dirs, this.files, this.bytes);
    })
    .walk();