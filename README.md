Pleeease
======

Postprocess CSS with ease.

Pleeease is a CSS post-processor. The main goal of this tool is to **perform all treatments that a pre-processor shouldn't have to do!** (eg, dealing with prefixes, convert `rem` to `px`, support older browsers, etc.).

***Pleeease* is also a great tool if you want to write DRY, future-proof CSS.**

For now, it adds **prefixes**, **variables**, **pseudo-elements** and **`rem`** unit support, **converts CSS shorthand filters to SVG equivalent**, **packs same media-query** in one `@media` rule, **inlines `@import`** styles and **minifies the result**.

Pleeease is based on [PostCSS](https://github.com/ai/postcss) postprocessor.

http://pleeease.io

##Example

You write `foo.css`:

```css
@import url("bar.css");
*,
*::after,
*::before {
	box-sizing: border-box;
}
:root {
	--color-primary: red;
	--color-secondary: blue;
}
.elem {
	font-size: 2rem;
	background: var(--color-primary);
	width: calc(100% - 50px);
	filter: blur(4px);
}
@media screen and (min-width: 36em) {
	.elem {
		color: var(--color-secondary)
	}
}
@media screen and (min-width: 36em) {
	.classe {
		background: linear-gradient(green, blue);
	}
}
```

You get `baz.css` (with all options set to `true`, except `minifier`)

```css
.bar {
	/* imported styles */
}
/* pseudo-elements are converted */
*,
*:after,
*:before {
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
}
:root {
	--color-primary: red;
	--color-secondary: blue;
}
.elem {
	font-size: 32px; /* fallback for rem support */
	font-size: 2rem;
	background: red; /* resolve variables */
	width: -webkit-calc(100% - 50px); /* add prefixes */
	width: calc(100% - 50px);
	filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="filter"><feGaussianBlur stdDeviation="4" /></filter></svg>#filter');
	filter: blur(4px);
}
/* pack same media-queries */
@media screen and (min-width: 36em) {
	.elem {
		color: blue
	}
	.classe {
		background: -webkit-gradient(linear, left top, left bottom, from(green), to(blue));
		background: -webkit-linear-gradient(green, blue);
		background: linear-gradient(green, blue);
	}
}
```

##Installation

	$ npm install pleeease

##Usage

###Programmatic

```javascript
var pleeease = require('pleeease'),
	fs       = require('fs');

var css = fs.readFileSync('app.css', 'utf8');

// define options here
var options = {};

var fixed = pleeease.process(css, options);

fs.writeFile('app.min.css', fixed, function (err) {
  if (err) {
    throw err;
  }
  console.log('File saved!');
});
```

###CLI

Install Pleeease globally

	$ npm install -g pleeease

Or use alternate syntax

	$ node ./bin/pleeease

Compile all CSS files from the root projet to `app.min.css`

	$ pleeease compile
	$ pleeease compile *.css to app.min.css

Compile `foo.css` to `bar.css`

	$ pleeease compile foo.css to bar.css

Compile multiple files to `app.min.css`

	$ pleeease compile foo.css bar.css

Compile `css/` folder to `public/css/app.min.css` (if folders doesn't exist, they will be created)

	$ pleeease compile css/ to public/css/app.min.css

You can also `watch` (with the same syntax) for live compilation.

	$ pleeease watch foo.css

Pleeease options can be set in a `.pleeeaserc` file (JSON-like), for example:

```javascript
{
	"in": ["foo.css"],
	"out": "bar.css",
	"fallbacks": {
		"autoprefixer": true
	},
	"optimizers": {
		"minifier": false
	}
}
```

* `in` is an array of files (default `[*.css]`)
* `out` is the path to the compiled file (default `app.min.css`)

For other options, see below.

###With Brunch

If you're using [Brunch](http://brunch.io), see [pleeease-brunch](https://github.com/iamvdo/pleeease-brunch)

##Options

These are the default options for now:

* `fallbacks`:
	* `autoprefixer`: `true`
	* `variables`: `true`
	* `filters`: `true`
	* `rem`: `true`
	* `pseudoElements`: `true`
* `optimizers`:
	* `import`: `true`
	* `minifier`: `true`
	* `mqpacker`: `true`

All options can be disabled with `false` keyword or modified using each postprocessor options.

###fallbacks.autoprefixer

Adds support for [Autoprefixer](https://github.com/ai/autoprefixer) that add vendor prefixes to CSS. Add options as an array:

```javascript
// set options
var options = {
	fallbacks: {
		autoprefixer: ['last 4 versions', 'Android 2.3']
	}
}
```

```javascript
// .pleeeaserc file
{
	"fallbacks": {
		"autoprefixer": ["last 4 versions", "Android 2.3"]
	}
}
```

See [available options for Autoprefixer](https://github.com/ai/autoprefixer#browsers).

###fallbacks.variables

Adds support for a "not so bad" [CSS variables polyfill](https://github.com/iamvdo/postcss-vars). There are no options.

###fallbacks.filters

Converts CSS shorthand filters to SVG equivalent. Uses [pleeease-filters](https://github.com/iamvdo/pleeease-filters). You can also force IE filters with an option:

```javascript
// set options
var options = {
	fallbacks: {
		filters: {oldIE: true}
	}
}
```

```javascript
// .pleeeaserc file
{
	"fallbacks": {
		"filters": {"oldIE": true}
	}
}
```

**Be careful**, not all browsers support CSS or SVG filters. For your information, latest WebKit browsers support CSS shorthand, Firefox support SVG filters and IE9- support IE filters (limited and slightly degraded). **It means that IE10+, Opera Mini and Android browsers have no support at all.**

###fallbacks.rem

Adds support for [pixrem](https://github.com/iamvdo/node-pixrem) that generates pixel fallbacks for rem units. Add options as an array:

```javascript
// set options
var options = {
	fallbacks: {
		rem: ['16px', {replace: true}]
	}
}
```

```javascript
// .pleeeaserc file
{
	"fallbacks": {
		"rem": ["16px", {"replace": true}]
	}
}
```

See [available options for pixrem](https://github.com/iamvdo/node-pixrem#parameters).

For now, this uses a fork from [pixrem](https://github.com/robwierzbowski/node-pixrem) until the [PR will be accepted or not](https://github.com/robwierzbowski/node-pixrem/pull/10).

###fallbacks.pseudoElements

Converts pseudo-elements using CSS3 syntax (two-colons notation like `::after`, `::before`, `::first-line` and `::first-letter`) with the old one, using only one colon (useful for IE8 support).

```css
.element::after {
	/* you write */
}
```

```css
.element:after {
	/* you get */
}
```

###optimizers.import

Inlines `@import` styles with relative paths (absolute ones will be unaffected). `@import` including media-queries are not changed either.

You can use the CSS syntax you want:

```css
@import "file.css";
@import url(file.css);
@import url("http://foo.com/bar.css"); /* not imported */
@import url("file.css") screen and (max-width: 35em); /* not imported */
```

Note that you can set the "root" folder for imported files, even if this is not the root of your project (default is `process.cwd()`). For example, if you compile `css/foo.css` containing an `@import` to `import.css` (so, in the same folder `css`), set options like this:

```javascript
// .pleeeaserc file
{
	"optimizers": {
		"import": "css"
	}
}
```

###optimizers.minifier

Adds support for [CSS Wring](https://github.com/hail2u/node-csswring), a CSS minifier. There are no options.

###optimizers.mqpacker

Adds support for [MQ Packer](https://github.com/hail2u/node-css-mqpacker) that pack same CSS media query rules into one media query rule. There are no options.

##Sourcemaps

Pleeease supports sourcemaps from CSS (disabled by default). Enabled them in `.pleeeaserc` file:

```javascript
// .pleeeaserc file
{
	"sourcemaps": true
}
```

##More

More postprocess tasks are coming, mainly fallbacks. If you need absolutely one, open an issue, or contribute!

##Licence

MIT © 2014 [Vincent De Oliveira &middot; iamvdo](https://github.com/iamvdo)