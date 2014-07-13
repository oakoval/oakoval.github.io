const
    fs = require('fs'),
    jade = require('jade');

var tmpl = fs.readFileSync('list.jade');
var dir = fs.readdirSync('code');
tmpl = jade.compile(tmpl);
fs.writeFileSync('index.html', tmpl({dir:dir}));