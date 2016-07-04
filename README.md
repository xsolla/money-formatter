# money-formatter

Simple Javascript library for currency formatting.

It allows you to format currencies without specifying any formatting arguments
besides the currency code and number value itself, thanks to rules from the [currency-format](https://github.com/xsolla/currency-format) package.

[![Travis build status](http://img.shields.io/travis/xsolla/money-formatter.svg?style=flat)](https://travis-ci.org/xsolla/money-formatter)
[![npm version](https://badge.fury.io/js/money-formatter.svg)](https://badge.fury.io/js/money-formatter)
[![Bower version](https://badge.fury.io/bo/money-formatter.svg)](https://badge.fury.io/bo/money-formatter)
[![Dependency Status](https://david-dm.org/xsolla/money-formatter.svg?bust)](https://david-dm.org/xsolla/money-formatter)
[![devDependency Status](https://david-dm.org/xsolla/money-formatter/dev-status.svg?bust)](https://david-dm.org/xsolla/money-formatter#info=devDependencies)


## Installation

Install from npm or bower

    npm install money-formatter
    # or bower install money-formatter

## Usage

### For Node.js, Browserify and Webpack

You can import whole module

```javascript
var moneyFormatter = require('money-formatter');
// Or in ES6
// import moneyFormatter from 'money-formatter';
moneyFormatter.format('USD', 10); // => '$10.00'
```

Or use separate functions

```javascript
import { format } from 'money-formatter';
format('EUR', 123); // => '€123.00'
```

### Other

You can add UMD distribution (from `dist/money-formatter.js`) directly to
HTML and use it with AMD loader or from the global object

```html
<script src="path/to/dist/money-formatter.js"></script>
<script>
    var moneyFormatter = require('money-formatter');
    // Or use window.moneyFormatter if you are not using requirejs;
</script>
```

## API

#### format(currencyCode, amount, [fractionSize=2, useAlphaCode=false]) => string

Formats number based on the specified currency params.

If `fractionSize` is not provided, the currency's fraction size from ISO 4217
will be used. It fallbacks to default value `2` if currency have no
fraction size.
`useAlphaCode` is a flag to use alphabetic code (e.g. 'USD') instead of
commonly used symbol (e.g. '$') and apply basic formatting from `formatSimple`.
You may want to use it in ASCII-only environments or if you want to
align output layout.

```javascript
moneyFormatter.format('USD', 1234567.89); // => '$1,234,567.89'
moneyFormatter.format('RUR', 10, 0); // => '10 ₽'
moneyFormatter.format('USD', 10, 0, true); // => '10 USD'
```

#### formatSimple(currencyName, amount, [fractionSize=2]) => string

```javascript
moneyFormatter.formatSimple('$$$', 123, 0); // => '123 $$$'
```

#### formatToHTML(currencyCode, amount, [fractionSize=2, useAlphaCode=false]) => string

Same as `format` but outputs string with HTML element for proper bidirectional
output in browsers.

```javascript
moneyFormatter.formatToHTML('SAR', -10); // => '<span dir="rtl">-10.00 ﷼</span>'
```
It will look like
<code dir="rtl">-10.00 ﷼</code>

## Development

1. Clone this repository
2. Run `npm install` inside cloned repository directory to install dependencies
3. To test the code during development run `npm test` to run tests once
or use `npm run watch` to watch for changes and autorun tests
4. Execute `npm run build` to build distributable files to the `dist/` dir

## License

The MIT License.

See [LICENSE](https://github.com/xsolla/money-formatter/blob/master/LICENSE)
