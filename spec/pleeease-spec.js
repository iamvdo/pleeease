// Jasmine unit tests
// To run tests, run these commands from the project root:
// 1. `npm install -g jasmine-node`
// 2. `jasmine-node spec`

'use strict';
var fs       = require('fs'),
    path     = require('path'),
    pleeease = require('../lib/'),
    options  = require('../lib/options');

beforeEach(function() {
  options.minifier = false;
});

describe('pleeease', function () {

  it('should generate -webkit- prefixes for calc() (support iOS6)', function () {
    // css
    var css = fs.readFileSync(path.join(__dirname, 'prefixes.css'));
    var expected = '.elem { width: -webkit-calc(100% - 50px); width: calc(100% - 50px); }';
    // options
    options.autoprefixer = ['iOS 6'];
    // process
    var processed = pleeease.process(css, options);

    expect(processed).toBe(expected);
  });

  it('should evaluate variables', function () {
    // css
    var css = ':root { --color-primary: red; } .elem { color: var(--color-primary); }';
    var expected = ':root { --color-primary: red; } .elem { color: red; }';
    // options
    options.fallbacks.variables = true;
    // process
    var processed = pleeease.process(css, options);

    expect(processed).toBe(expected);
  });

  it('should evaluate variables in variables', function () {
    // css
    var css = ':root { --color-primary: red; --color-secondary: var(--color-primary); } .elem { color: var(--color-secondary); }';
    var expected = ':root { --color-primary: red; --color-secondary: var(--color-primary); } .elem { color: red; }';
    // options
    options.fallbacks.variables = true;
    // process
    var processed = pleeease.process(css, options);

    expect(processed).toBe(expected);
  });

  it('should replace pseudo-elements syntax', function () {
    // css
    var css = '.test::after, .test::before { content: \'\' }';
    var expected = '.test:after, .test:before { content: \'\' }';
    // options
    options.fallbacks.pseudoElements = true;
    // process
    var processed = pleeease.process(css, options);

    expect(processed).toBe(expected);
  });

  it('should replace pseudo-elements syntax in media-queries', function () {
    // css
    var css = '@media screen { .test::after, .test::before { content: \'\' } }';
    var expected = '@media screen { .test:after, .test:before { content: \'\' } }';
    // options
    options.fallbacks.pseudoElements = true;
    // process
    var processed = pleeease.process(css, options);

    expect(processed).toBe(expected);
  });

  it('should minify when asked', function() {
    //css
    var css = '.elem {\n' +
            'color: #f39;\n' +
        '}';
    var expected = '.elem{color:#f39}';
    // options
    options.minifier = true;
    // process
    var processed = pleeease.process(css, options);

    expect(processed).toBe(expected);
  });

  it('should combine files', function() {
    var compile = function (inputs, options) {
      // get inputs files
      var CSS = inputs.map(function(input) {
        return fs.readFileSync(input).toString();
      });
      // fixed CSS
      return pleeease.process(CSS.join('\n'), options);
    };

    // process
    var processed = compile(['test/bar.css', 'test/foo.css'], options);
    var expected = fs.readFileSync('test/app.min.css').toString();

    expect(processed).toBe(expected);
  });

});