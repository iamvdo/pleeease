Pleeease
======

Postprocess CSS with ease.

Pleeease is the best toolchain for your CSS. Just write DRY, future-proof CSS and Pleeease do the job for you.

For now, it adds prefixes, variables and `rem` unit support, packs same media-query in one `@media` rule and minify it.

Pleeease is based on [PostCSS](https://github.com/ai/postcss) postprocessor.

##Example

You write `foo.css`:

```css
:root {
	--color-primary: red;
	--color-secondary: blue;
}
.elem {
	font-size: 2rem;
	color: red;
	background: var(--color-primary);
	width: calc(100% - 50px);
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

You get `bar.css` (with all options set to `true`, except `minifier`)

```css
:root {
	--color-primary: red;
	--color-secondary: blue;
}
.elem {
	font-size: 32px;
	font-size: 2rem;
	color: red;
	background: red;
	width: -webkit-calc(100% - 50px);
	width: calc(100% - 50px);
}
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
	"input": ["foo.css"],
	"output": "bar.css",
	"autoprefixer": true,
	"minifier": false
}
```

* `input` is an array of files (default `[*.css]`)
* `output` is the path to the compiled file (default `app.min.css`)

For other options, see below.

###With Brunch

If you're using [Brunch](http://brunch.io), see [pleeease-brunch](https://github.com/iamvdo/pleeease-brunch)

##Options

These are the default options for now:

* `autoprefixer`: `true`
* `minifier`: `true`
* `mqpacker`: `true`
* `fallbacks`:
	* `variables`: `true`
	* `rem`: `true`

All options can be disabled with `false` keyword or modified using each postprocessor options.

###autoprefixer

Add support for [Autoprefixer](https://github.com/ai/autoprefixer) that add vendor prefixes to CSS. Add options as an array:

```javascript
// set options
var options = {
	autoprefixer: ['last 4 versions', 'Android 2.3']
}
```

```javascript
// .pleeeaserc file
{
	"autoprefixer": ["last 4 versions", "Android 2.3"]
}
```

See [available options for Autoprefixer](https://github.com/ai/autoprefixer#browsers).

###minifier

Add support for [CSS Wring](https://github.com/hail2u/node-csswring), a CSS minifier. There are no options.

###mqpacker

Add support for [MQ Packer](https://github.com/hail2u/node-css-mqpacker) that pack same CSS media query rules into one media query rule. There are no options.

###fallbacks.variables

Add support for a "not so bad" [CSS variables polyfill](https://github.com/iamvdo/postcss-vars). There are no options.

###fallbacks.rem

Add support for [pixrem](https://github.com/iamvdo/node-pixrem) that generates pixel fallbacks for rem units. Add options as an array:

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

##More

More postprocess tasks are coming, mainly polyfills (eg. CSS filters, pseudo-classes/pseudo-elements, rgba/hsla functions, etc.).

##Licence

MIT

Vincent De Oliveira
