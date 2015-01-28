See changelog for versions > 1.0 in [Releases](https://github.com/iamvdo/pleeease/releases).

## HEAD

* Added:
  * PostCSS 4.x (and all modules based on it)
  * Autoprefixer 5.x
  * Preprocessors (Sass, LESS, Stylus)
* Fixed:
  * `browsers` option when many browsers are set

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