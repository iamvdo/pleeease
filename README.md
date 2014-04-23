Pleeease
======

Postprocess CSS with ease.

Pleeease is the best toolchain for your CSS. Keep writing DRY, future-proof CSS.

For now, it adds prefixes, variables and `rem` unit support, packs same media-query in one `@media` rule and minify it.

Pleeease is based on [PostCSS](https://github.com/ai/postcss) postprocessor.


##Usage

	npm install pleeease

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

###With Brunch

Use [pleeease-brunch](https://github.com/iamvdo/pleeease-brunch)

##Example

It takes this CSS:

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

And returns (with default options):

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

##Options

These are the default options for now:

```javascript
var options = {
	autoprefixer: true,
	minifier: true,
	mqpacker: true,
	polyfills: {
		variables: true,
		rem: false
	}
}
```

All options can be disabled with `false` keyword.

###autoprefixer

Add support for [Autoprefixer](https://github.com/ai/autoprefixer) that add vendor prefixes to CSS. Add options as an array:

```javascript
// set options
var options = {
	autoprefixer: ['last 4 versions', 'Android 2.3']
}
```

See [available options](https://github.com/ai/autoprefixer#browsers).

###minifier

Add support for [CSS Wring](https://github.com/hail2u/node-csswring), a CSS minifier. There are no options.

###mqpacker

Add support for [MQ Packer](https://github.com/hail2u/node-css-mqpacker) that pack same CSS media query rules into one media query rule. There are no options.

###polyfills.variables

Add support for a "not so bad" [CSS variables polyfill](https://github.com/iamvdo/postcss-vars). There are no options.

###polyfills.rem

Add support for [pixrem](https://github.com/iamvdo/node-pixrem) that generates pixel fallbacks for rem units. Add options as an array:

```javascript
// set options
var options = {
	polyfills: {
		rem: ['16px', {replace: true}]
	}
}
```

See [available options](https://github.com/iamvdo/node-pixrem#parameters).

For now, this uses a fork from [pixrem](https://github.com/robwierzbowski/node-pixrem) until the [PR will be accepted or not](https://github.com/robwierzbowski/node-pixrem/pull/10).

##More

More postprocess tasks are coming, mainly polyfills (eg. CSS filters, pseudo-classes/pseudo-elements, rgba/hsla functions, etc.).

##Licence

MIT
