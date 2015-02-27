var pleeease = require('../lib/pleeease.js');
var fs       = require('fs');

var opts = {
  'sass': {
    'includePaths': ['app/src/scss']
  },
  'in': 'app/src/scss/main.scss',
  'out': 'app/dist/main.css',
  'sourcemaps': true
};



var css = fs.readFileSync('app/src/scss/main.scss', 'utf-8');

var SassOpts = {
  file: opts.in,
  outFile: opts.out,
  data: css,
  sourceMap: true
};

css = require('node-sass').renderSync(SassOpts);

var sourcemaps = {
  'from': opts.in,
  'to': opts.out,
  'map': {
    'prev': css.map,
    'inline': false
  }
};
var pleeeaseOpts = { sourcemaps : sourcemaps, minifier: false };

var out = pleeease.process(css.css, pleeeaseOpts);
//var out = require('postcss')().process(css.css, sourcemaps);

console.log(out.map.toJSON());

fs.writeFileSync('app/dist/main.css', out.css);
fs.writeFileSync('app/dist/main.css.map', out.map);