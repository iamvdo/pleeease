// Jasmine unit tests
// To run tests, run these commands from the project root:
// 1. `npm install -g jasmine-node`
// 2. `jasmine-node spec`

'use strict';
var fs       = require('fs'),
    path     = require('path'),
    pleeease = require('../lib/'),
    options  = {
      autoprefixer: false,
      minifier: false,
      mqpacker: false,
      polyfills: {
        variables: false,
        rem: false
      }
    };

describe('pleeease', function () {

  it('should generate -webkit- prefixes for calc() (support iOS6)', function () {
    // css
    var css = fs.readFileSync(path.join(__dirname, 'prefixes.css'));
    var expected = '.elem { width: -webkit-calc(100% - 50px); width: calc(100% - 50px); }';
    // options
    var opts = options;
    opts.autoprefixer = ['iOS 6'];
    // process
    var processed = pleeease.process(css, opts);

    expect(processed).toBe(expected);
  });

  it('should evaluate variables', function () {
    // css
    var css = ':root { --color-primary: red; } .elem { color: var(--color-primary); }';
    var expected = ':root { --color-primary: red; } .elem { color: red; }';
    // options
    var opts = options;
    opts.polyfills.variables = true;
    // process
    var processed = pleeease.process(css, opts);

    expect(processed).toBe(expected);
  });

  it('should evaluate variables in variables', function () {
    // css
    var css = ':root { --color-primary: red; --color-secondary: var(--color-primary); } .elem { color: var(--color-secondary); }';
    var expected = ':root { --color-primary: red; --color-secondary: var(--color-primary); } .elem { color: red; }';
    // options
    var opts = options;
    opts.polyfills.variables = true;
    // process
    var processed = pleeease.process(css, opts);

    expect(processed).toBe(expected);
  });

});