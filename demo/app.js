var pleeease = require('../lib/pleeease.js');
var fs       = require('fs');

var opts = {
  'sass': {
    'includePaths': ['app/src/scss']
  },
  'sourcemaps': {
    'map': {
      'inline': false
    },
    'from': 'app/src/scss/main.scss',
    'to': 'app/dist/main.css'
  }
};

var css = fs.readFileSync('app/src/scss/main.scss', 'utf-8');

var out = pleeease.process(css, opts);

fs.writeFileSync('app/dist/main.css', out.css);
fs.writeFileSync('app/dist/main.css.map', out.map);