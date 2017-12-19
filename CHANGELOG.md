**4.3.0** (2017-12-19) Update postcss-url (#86)
**4.2.1** (2017-03-17) Fix fs-extra version (compatibility Node 0.12)
**4.2.0** (2017-03-17) Update modules (compatibility Node 7)

## 4.1.0 - 2016-08-22

* Update Autoprefixer to 6.4 (and caniuse data)
* Update Pixrem to 3.0.2 (fix a reduce-css-calc bug)

**4.0.5** (2016-07-19) Update dependencies (LESS, node-sass, stylus)

**4.0.4** (2015-11-12) Add stable Node to Travis (+ update node-sass)

**4.0.3** (2015-10-29) Fix sourcemaps creation for LESS

**4.0.2** (2015-10-27) Fix broken output when pleeease-cli gives pleeease.parse AST data (#62)

**4.0.1** (2015-09-30) Fix test on Windows

## [4.0.0] - 2015-09-30

* Changes: Remove pleeease.NEXT
* Changes: API is now aync only
* Added: new vmin postprocessor
* Added: new `modules` option, to add every PostCSS plugins you need
* Added: Node.js 4
* Added: PostCSS 5, Autoprefixer 6 & other PostCSS modules
* Added: Node-sass 3.3, Stylus 0.52
* Fixed: browsers key no longer override autoprefixer's one

## 3.4.0 - 2015-07-15

* Added: Option `rebaseUrls` to rebase URLs (or not)

## 3.3.0 - 2015-05-27

* Added: Autoprefixer 5.2
* Fix: feature detection from caniuse data

## 3.2.6 - 2015-04-08

* Fixed:
  * Sourcemaps with PostCSS 4.1
  * postcss-url with PostCSS 4.1

## 3.2.5 - 2015-03-30

* Changed:
  * Replace pseudo elements processor with dedicated module
  * Remove annotation from preprocess step

## 3.2.4 - 2015-03-18

* Fixed:
  * Apply previous sourcemap only if sourcemaps.map exists
  * Set annotation:true only if it's not false

## 3.2.3 - 2015-03-05

* Fixed:
  * Standalone version (by using own browserslist and caniuse-db)

## 3.2.2 - 2015-03-03

* Fixed:
  * Rebase URL according to `options.out` or `options.sourcemaps.to` (Ref #34)

## 3.2.1 - 2015-03-03

* Fixed:
  * Sourcemaps from preprocessors to postprocessors
  * No longer read .pleeeaserc file in this module
* Changed:
  * Use postcss-opacity instead of processors/opacity

## 3.2.0 - 2015-02-16

* Added:
  * Sass 2.0.0 (node-sass)
* Fixed:
  * Sourcemaps from preprocessors to postprocessors
  * Read .pleeeaserc file with Node.js 0.12

## 3.1.0 - 2015-02-10

* Added:
  * Less 2.4.0
  * Stylus 0.50.0

## 3.0.1 - 2015-02-09

* Fixed:
  * URLs rewriting by adding `to` to PostCSS options

## [3.0.0] - 2015-02-05

* Added:
  * PostCSS 4.x (and all modules based on it)
  * Autoprefixer 5.x
  * Experimental: adding preprocessors (Sass, LESS, Stylus)
  * Expose Pleeease as a plugin (can be chained in postcss)
* Fixed:
  * `browsers` option when many browsers are set
  * Rebase urls in imported files with `postcss-url`
* Changed:
  * Pleeease module no longer contains cli tool, there's now a new [pleeease-cli](https://github.com/iamvdo/pleeease-cli) module

## [2.0.0] - 2014-11-26

* Added:
  * PostCSS 3.x
  * Pixrem 1.x
  * New `browsers` option
* Changed:
  * `mqpacker` option set to `false` by default

## 1.1.2 - 2014-09-29

* Fixed:
  * Pixrem processor call

## 1.1.1 - 2014-08-28

* Fixed:
  * Update CSS Wring
  * Update CSS Mqpacker

## [1.1.0] - 2014-08-26

* Added:
  * Opacity filter for IE8
* Fixed:
  * `rem` conversion

## [1.0.0] - 2014-08-25

* Added:
  * Autoprefixer 3.x
  * Pleeease.NEXT (mostly cssnext)
* Changed:
  * No more "subcategories" for options
  * Use postcss-import module instead of specific one

## 0.4.4 - 2014-07-24

* Added:
  * PostCSS 2.x
* Changed:
  * Standalone version now made with Browserify 5.x

## 0.4.3 - 2014-07-20

* Fixed:
  * Fix encoding problem in 0.4.2

## 0.4.2 - 2014-07-17

* Added:
  * Standalone version available now for each version
* Changed:
  * Better sourcemaps integration. Now read prev sourcemaps (from Sass for example)


## 0.4.1 - 2014-07-02

* Added:
  * pleeease-filters postprocessor: converts CSS shorthand filters to SVG equivalent

## 0.4.0 - 2014-06-27

* Added:
  * PostCSS 1.x and Autoprefixer 2.x
  * Sourcemaps support
* Changed:
  * Better watch command
  * Options `input` and `output` renamed to `in` and `out`
  * Improve `@import` (`options.optimizers.import` can now receive a dirname)

## 0.3.0 - 2014-05-19
* Added:
  * `@import` processor
* Changed:
  * Refactor default options

[1.0.0]: https://github.com/iamvdo/pleeease/releases/tag/1.0.0
[1.1.0]: https://github.com/iamvdo/pleeease/releases/tag/1.1.0
[2.0.0]: https://github.com/iamvdo/pleeease/releases/tag/2.0.0
[3.0.0]: https://github.com/iamvdo/pleeease/releases/tag/3.0.0
[4.0.0]: https://github.com/iamvdo/pleeease/releases/tag/4.0.0