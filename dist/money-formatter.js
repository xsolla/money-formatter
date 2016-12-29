(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["moneyFormatter"] = factory();
	else
		root["moneyFormatter"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.formatToHTML = exports.format = exports.formatSimple = undefined;
	
	var _currencyFormat = __webpack_require__(1);
	
	var _currencyFormat2 = _interopRequireDefault(_currencyFormat);
	
	var _utils = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// eslint-disable-next-line import/no-extraneous-dependencies,import/extensions
	var getCurrencyData = function getCurrencyData(code) {
	  return _currencyFormat2.default[code.toUpperCase()];
	};
	
	var formatSimple = exports.formatSimple = function formatSimple(currencyName, amount, fractionSize) {
	  return (0, _utils.formatDigits)(amount, fractionSize) + ' ' + currencyName;
	};
	
	/**
	 * Return true if arguments are valid
	 */
	var validateCurrencyArgs = function validateCurrencyArgs(currencyCode, amount) {
	  return typeof currencyCode === 'string' && (0, _utils.isNumeric)(amount);
	};
	
	/**
	 * Formats number based on the specified currency params
	 * @param  {string} currencyCode            Currency alphabetic code in ISO 4217 format, e.g. 'USD'
	 * @param  {number} amount                  Currency amount
	 * @param  {number} [fractionSize=2]        Number of digits to display after dot.
	 *  Default value is currency's `fractionSize` or 2 digits.
	 * @param  {boolean} [useAlphaCode=false]   Use alphabetic code (e.g. 'USD') instead of
	 *  commonly used symbol (e.g. '$'). You may want to use it in ASCII-only environments
	 *  or if You want to align output layout.
	 * @return {string}                         Formatted string
	 */
	var format = exports.format = function format(currencyCode, amount, fractionSize, useAlphaCode) {
	  if (!validateCurrencyArgs(currencyCode, amount)) {
	    return '';
	  }
	  var currency = getCurrencyData(currencyCode);
	  /**
	   * If it's not real ISO 4217 currency return the amount in simple notation
	   * ---
	   * You should only pass correct codes, this corner-case handling added
	   * for more reliability.
	   * For possibly incorrect codes use {@link formatSimple}
	   */
	  if (!currency) {
	    return formatSimple(currencyCode, amount, fractionSize);
	  }
	
	  var symbol = currency.symbol || currency.uniqSymbol;
	  // If the alphabetic code was requested instead of standard symbol,
	  // we shouldn't use special template and other advanced formatting
	  if (useAlphaCode || !symbol) {
	    return formatSimple(currencyCode.toUpperCase(), amount, fractionSize);
	  }
	
	  var fractionLength = typeof fractionSize === 'undefined' ? currency.fractionSize : fractionSize;
	
	  // Extract sign to put it before all other parts
	  var amountString = (0, _utils.formatDigits)(Math.abs(amount), fractionLength);
	  var signString = amount < 0 ? '−' : '';
	
	  var formattedCurrency = symbol.template.replace('1', amountString).replace('$', symbol.grapheme);
	  return signString + formattedCurrency;
	};
	
	/**
	 * Check whether given currency should be left-to-right or right-to-left formatted.
	 * @param  {string} currencyCode Code of currency from 'currency-format' library
	 * @return {boolean}             true if rtl, else false
	 */
	var isRTLCurrency = function isRTLCurrency(currencyCode) {
	  var currencyObj = getCurrencyData(currencyCode);
	  if (currencyObj) {
	    var symbol = currencyObj.symbol || currencyObj.uniqSymbol;
	    // If symbol data is found, return it, else mark the currency as 'ltr'
	    return symbol ? symbol.rtl : false;
	  }
	  return false;
	};
	
	var currencyHTMLTemplate = function currencyHTMLTemplate(options) {
	  var formattedCurrency = options.formattedCurrency,
	      isRTL = options.isRTL;
	
	  return '<span dir="' + (isRTL ? 'rtl' : 'ltr') + '">' + formattedCurrency + '</span>';
	};
	
	/**
	 * Same as `format` but outputs string with HTML element for proper
	 * bidirectional output in browsers.
	 * This is just decorator of {@link format}
	 *
	 * @see {@link format} for function arguments
	 * @return {string} HTML element with formatted currency as a string
	 */
	var formatToHTML = exports.formatToHTML = function formatToHTML() {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	
	  var code = args[0],
	      amount = args[1];
	
	  if (validateCurrencyArgs(code, amount)) {
	    var formattedCurrency = format.apply(undefined, args);
	    return currencyHTMLTemplate({
	      formattedCurrency: formattedCurrency,
	      isRTL: isRTLCurrency(code)
	    });
	  }
	  return currencyHTMLTemplate({
	    formattedCurrency: '',
	    isRTL: false
	  });
	};
	
	exports.default = {
	  format: format,
	  formatSimple: formatSimple,
	  formatToHTML: formatToHTML
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = {
		"AED": {
			"name": "UAE Dirham",
			"fractionSize": 2,
			"symbol": {
				"grapheme": ".د.إ",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": null
		},
		"AFN": {
			"name": "Afghani",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "؋",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": {
				"grapheme": "؋",
				"template": "1 $",
				"rtl": true
			}
		},
		"ALL": {
			"name": "Lek",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "L",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "Lek",
				"template": "$1",
				"rtl": false
			}
		},
		"AMD": {
			"name": "Armenian Dram",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "դր.",
				"template": "1 $",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "դր.",
				"template": "1 $",
				"rtl": false
			}
		},
		"ANG": {
			"name": "Netherlands Antillean Guilder",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "ƒ",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "NAƒ",
				"template": "$1",
				"rtl": false
			}
		},
		"AOA": {
			"name": "Kwanza",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"ARS": {
			"name": "Argentine Peso",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"AUD": {
			"name": "Australian Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "A$",
				"template": "$1",
				"rtl": false
			}
		},
		"AWG": {
			"name": "Aruban Florin",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "ƒ",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "Afl",
				"template": "$1",
				"rtl": false
			}
		},
		"AZN": {
			"name": "Azerbaijanian Manat",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₼",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₼",
				"template": "$1",
				"rtl": false
			}
		},
		"BAM": {
			"name": "Convertible Mark",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "KM",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "KM",
				"template": "$1",
				"rtl": false
			}
		},
		"BBD": {
			"name": "Barbados Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"BDT": {
			"name": "Taka",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"BGN": {
			"name": "Bulgarian Lev",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "лв",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "лв",
				"template": "$1",
				"rtl": false
			}
		},
		"BHD": {
			"name": "Bahraini Dinar",
			"fractionSize": 3,
			"symbol": {
				"grapheme": ".د.ب",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": {
				"grapheme": ".د.ب",
				"template": "1 $",
				"rtl": true
			}
		},
		"BIF": {
			"name": "Burundi Franc",
			"fractionSize": 0,
			"symbol": null,
			"uniqSymbol": null
		},
		"BMD": {
			"name": "Bermudian Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "BD$",
				"template": "$1",
				"rtl": false
			}
		},
		"BND": {
			"name": "Brunei Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"BOB": {
			"name": "Boliviano",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "Bs.",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "Bs.",
				"template": "$1",
				"rtl": false
			}
		},
		"BOV": {
			"name": "Mvdol",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"BRL": {
			"name": "Brazilian Real",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "R$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "R$",
				"template": "$1",
				"rtl": false
			}
		},
		"BSD": {
			"name": "Bahamian Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"BTN": {
			"name": "Ngultrum",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"BWP": {
			"name": "Pula",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "P",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "P",
				"template": "$1",
				"rtl": false
			}
		},
		"BYN": {
			"name": "Belarussian Ruble",
			"fractionSize": 0,
			"symbol": {
				"grapheme": "p.",
				"template": "1 $",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "р.",
				"template": "1 $",
				"rtl": false
			}
		},
		"BYR": {
			"name": "Belarussian Ruble",
			"fractionSize": 0,
			"symbol": {
				"grapheme": "p.",
				"template": "1 $",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "р.",
				"template": "1 $",
				"rtl": false
			}
		},
		"BZD": {
			"name": "Belize Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "BZ$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "BZ$",
				"template": "$1",
				"rtl": false
			}
		},
		"CAD": {
			"name": "Canadian Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "CA$",
				"template": "$1",
				"rtl": false
			}
		},
		"CDF": {
			"name": "Congolese Franc",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"CHE": {
			"name": "WIR Euro",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"CHF": {
			"name": "Swiss Franc",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "CHF",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "CHF",
				"template": "$1",
				"rtl": false
			}
		},
		"CHW": {
			"name": "WIR Franc",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"CLF": {
			"name": "Unidad de Fomento",
			"fractionSize": 4,
			"symbol": null,
			"uniqSymbol": null
		},
		"CLP": {
			"name": "Chilean Peso",
			"fractionSize": 0,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"CNY": {
			"name": "Yuan Renminbi",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "元",
				"template": "1 $",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "元",
				"template": "1 $",
				"rtl": false
			}
		},
		"COP": {
			"name": "Colombian Peso",
			"fractionSize": 0,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"COU": {
			"name": "Unidad de Valor Real",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"CRC": {
			"name": "Cost Rican Colon",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₡",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₡",
				"template": "$1",
				"rtl": false
			}
		},
		"CUC": {
			"name": "Peso Convertible",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"CUP": {
			"name": "Cuban Peso",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$MN",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "$MN",
				"template": "$1",
				"rtl": false
			}
		},
		"CVE": {
			"name": "Cabo Verde Escudo",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"CZK": {
			"name": "Czech Koruna",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "Kč",
				"template": "1 $",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "Kč",
				"template": "1 $",
				"rtl": false
			}
		},
		"DJF": {
			"name": "Djibouti Franc",
			"fractionSize": 0,
			"symbol": null,
			"uniqSymbol": null
		},
		"DKK": {
			"name": "Danish Krone",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "kr",
				"template": "1 $",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"DOP": {
			"name": "Dominican Peso",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "RD$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "RD$",
				"template": "$1",
				"rtl": false
			}
		},
		"DZD": {
			"name": "Algerian Dinar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": ".د.ج",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": {
				"grapheme": ".د.ج",
				"template": "1 $",
				"rtl": true
			}
		},
		"EEK": {
			"name": "Estonian Kroon",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "kr",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"EGP": {
			"name": "Egyptian Pound",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "£",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": ".ج.م",
				"template": "1 $",
				"rtl": true
			}
		},
		"ERN": {
			"name": "Nakfa",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"ETB": {
			"name": "Ethiopian Birr",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"EUR": {
			"name": "Euro",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "€",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "€",
				"template": "$1",
				"rtl": false
			}
		},
		"FJD": {
			"name": "Fiji Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "FJ$",
				"template": "$1",
				"rtl": false
			}
		},
		"FKP": {
			"name": "Falkland Islands Pound",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "£",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"GBP": {
			"name": "Pound Sterling",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "£",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "£",
				"template": "$1",
				"rtl": false
			}
		},
		"GEL": {
			"name": "Lari",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"GGP": {
			"name": "Guernsey Pound",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "£",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"GHC": {
			"name": "Ghanaian Cedi",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "¢",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "¢",
				"template": "$1",
				"rtl": false
			}
		},
		"GHS": {
			"name": "Ghan Cedi",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"GIP": {
			"name": "Gibraltar Pound",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "£",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"GMD": {
			"name": "Dalasi",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"GNF": {
			"name": "Guine Franc",
			"fractionSize": 0,
			"symbol": null,
			"uniqSymbol": null
		},
		"GTQ": {
			"name": "Quetzal",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "Q",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "Q",
				"template": "$1",
				"rtl": false
			}
		},
		"GYD": {
			"name": "Guyan Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "GY$",
				"template": "$1",
				"rtl": false
			}
		},
		"HKD": {
			"name": "Hong Kong Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "HK$",
				"template": "$1",
				"rtl": false
			}
		},
		"HNL": {
			"name": "Lempira",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "L",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "L",
				"template": "$1",
				"rtl": false
			}
		},
		"HRK": {
			"name": "Croatian Kuna",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "kn",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "kn",
				"template": "$1",
				"rtl": false
			}
		},
		"HTG": {
			"name": "Gourde",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"HUF": {
			"name": "Forint",
			"fractionSize": 0,
			"symbol": {
				"grapheme": "Ft",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "Ft",
				"template": "$1",
				"rtl": false
			}
		},
		"IDR": {
			"name": "Rupiah",
			"fractionSize": 3,
			"symbol": {
				"grapheme": "Rp",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "Rp",
				"template": "$1",
				"rtl": false
			}
		},
		"ILS": {
			"name": "New Israeli Sheqel",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₪",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₪",
				"template": "$1",
				"rtl": false
			}
		},
		"IMP": {
			"name": "Manx Pound",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "£",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"INR": {
			"name": "Indian Rupee",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₹",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₹",
				"template": "$1",
				"rtl": false
			}
		},
		"IQD": {
			"name": "Iraqi Dinar",
			"fractionSize": 3,
			"symbol": {
				"grapheme": ".د.ع",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": {
				"grapheme": ".د.ع",
				"template": "1 $",
				"rtl": true
			}
		},
		"IRR": {
			"name": "Iranian Rial",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "﷼",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": {
				"grapheme": ".ر.ا",
				"template": "1 $",
				"rtl": true
			}
		},
		"ISK": {
			"name": "Iceland Krona",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "kr",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"JEP": {
			"name": "Jersey Pound",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "£",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"JMD": {
			"name": "Jamaican Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "J$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "J$",
				"template": "$1",
				"rtl": false
			}
		},
		"JOD": {
			"name": "Jordanian Dinar",
			"fractionSize": 3,
			"symbol": {
				"grapheme": ".د.إ",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": null
		},
		"JPY": {
			"name": "Yen",
			"fractionSize": 0,
			"symbol": {
				"grapheme": "¥",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "¥",
				"template": "$1",
				"rtl": false
			}
		},
		"KES": {
			"name": "Kenyan Shilling",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "KSh",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "KSh",
				"template": "$1",
				"rtl": false
			}
		},
		"KGS": {
			"name": "Som",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "сом",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "сом",
				"template": "$1",
				"rtl": false
			}
		},
		"KHR": {
			"name": "Riel",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "៛",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "៛",
				"template": "$1",
				"rtl": false
			}
		},
		"KMF": {
			"name": "Comoro Franc",
			"fractionSize": 0,
			"symbol": null,
			"uniqSymbol": null
		},
		"KPW": {
			"name": "North Korean Won",
			"fractionSize": 0,
			"symbol": {
				"grapheme": "₩",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"KRW": {
			"name": "Won",
			"fractionSize": 0,
			"symbol": {
				"grapheme": "₩",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₩",
				"template": "$1",
				"rtl": false
			}
		},
		"KWD": {
			"name": "Kuwaiti Dinar",
			"fractionSize": 3,
			"symbol": {
				"grapheme": ".د.ك",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": {
				"grapheme": ".د.ك",
				"template": "1 $",
				"rtl": true
			}
		},
		"KYD": {
			"name": "Cayman Islands Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "CI$",
				"template": "$1",
				"rtl": false
			}
		},
		"KZT": {
			"name": "Tenge",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₸",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₸",
				"template": "$1",
				"rtl": false
			}
		},
		"LAK": {
			"name": "Kip",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₭",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₭",
				"template": "$1",
				"rtl": false
			}
		},
		"LBP": {
			"name": "Lebanese Pound",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "£",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": ".ل.ل",
				"template": "1 $",
				"rtl": true
			}
		},
		"LKR": {
			"name": "Sri Lank Rupee",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₨",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"LRD": {
			"name": "Liberian Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "L$",
				"template": "$1",
				"rtl": false
			}
		},
		"LSL": {
			"name": "Loti",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"LTL": {
			"name": "Lithuanian Litas",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "Lt",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "Lt",
				"template": "$1",
				"rtl": false
			}
		},
		"LVL": {
			"name": "Latvian Lats",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "Ls",
				"template": "1 $",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "Ls",
				"template": "1 $",
				"rtl": false
			}
		},
		"LYD": {
			"name": "Libyan Dinar",
			"fractionSize": 3,
			"symbol": {
				"grapheme": ".د.ل",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": {
				"grapheme": ".د.ل",
				"template": "1 $",
				"rtl": true
			}
		},
		"MAD": {
			"name": "Moroccan Dirham",
			"fractionSize": 2,
			"symbol": {
				"grapheme": ".د.م",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": {
				"grapheme": ".د.م",
				"template": "1 $",
				"rtl": true
			}
		},
		"MDL": {
			"name": "Moldovan Leu",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"MGA": {
			"name": "Malagasy riary",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"MKD": {
			"name": "Denar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "ден",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "ден",
				"template": "$1",
				"rtl": false
			}
		},
		"MMK": {
			"name": "Kyat",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"MNT": {
			"name": "Tugrik",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₮",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₮",
				"template": "$1",
				"rtl": false
			}
		},
		"MOP": {
			"name": "Pataca",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"MRO": {
			"name": "Ouguiya",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"MUR": {
			"name": "Mauritius Rupee",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₨",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"MVR": {
			"name": "Rufiyaa",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"MWK": {
			"name": "Kwacha",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"MXN": {
			"name": "Mexican Peso",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"MXV": {
			"name": "Mexican Unidad de Inversion (UDI)",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"MYR": {
			"name": "Malaysian Ringgit",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "RM",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "RM",
				"template": "$1",
				"rtl": false
			}
		},
		"MZN": {
			"name": "Mozambique Metical",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "MT",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "MT",
				"template": "$1",
				"rtl": false
			}
		},
		"NAD": {
			"name": "Namibi Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "N$",
				"template": "$1",
				"rtl": false
			}
		},
		"NGN": {
			"name": "Naira",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₦",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₦",
				"template": "$1",
				"rtl": false
			}
		},
		"NIO": {
			"name": "Cordob Oro",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "C$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "C$",
				"template": "$1",
				"rtl": false
			}
		},
		"NOK": {
			"name": "Norwegian Krone",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "kr",
				"template": "1 $",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"NPR": {
			"name": "Nepalese Rupee",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₨",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"NZD": {
			"name": "New Zealand Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "NZ$",
				"template": "$1",
				"rtl": false
			}
		},
		"OMR": {
			"name": "Rial Omani",
			"fractionSize": 3,
			"symbol": {
				"grapheme": "﷼",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": {
				"grapheme": ".ر.ع",
				"template": "1 $",
				"rtl": true
			}
		},
		"PAB": {
			"name": "Balboa",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "B/.",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "B/.",
				"template": "$1",
				"rtl": false
			}
		},
		"PEN": {
			"name": "Nuevo Sol",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "S/.",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "S/.",
				"template": "$1",
				"rtl": false
			}
		},
		"PGK": {
			"name": "Kina",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"PHP": {
			"name": "Philippine Peso",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₱",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₱",
				"template": "$1",
				"rtl": false
			}
		},
		"PKR": {
			"name": "Pakistan Rupee",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₨",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"PLN": {
			"name": "Zloty",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "zł",
				"template": "1 $",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "zł",
				"template": "1 $",
				"rtl": false
			}
		},
		"PYG": {
			"name": "Guarani",
			"fractionSize": 0,
			"symbol": {
				"grapheme": "Gs",
				"template": "1$",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "Gs",
				"template": "1$",
				"rtl": false
			}
		},
		"QAR": {
			"name": "Qatari Rial",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "﷼",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": {
				"grapheme": ".ر.ق",
				"template": "1 $",
				"rtl": true
			}
		},
		"RON": {
			"name": "New Romanian Leu",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "lei",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "lei",
				"template": "$1",
				"rtl": false
			}
		},
		"RSD": {
			"name": "Serbian Dinar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "Дин.",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "Дин.",
				"template": "$1",
				"rtl": false
			}
		},
		"RUB": {
			"name": "Russian Ruble",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₽",
				"template": "1 $",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₽",
				"template": "1 $",
				"rtl": false
			}
		},
		"RUR": {
			"name": "Russian Ruble",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₽",
				"template": "1 $",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₽",
				"template": "1 $",
				"rtl": false
			}
		},
		"RWF": {
			"name": "Rwand Franc",
			"fractionSize": 0,
			"symbol": null,
			"uniqSymbol": null
		},
		"SAR": {
			"name": "Saudi Riyal",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "﷼",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": {
				"grapheme": ".ر.س",
				"template": "1 $",
				"rtl": true
			}
		},
		"SBD": {
			"name": "Solomon Islands Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "SI$",
				"template": "$1",
				"rtl": false
			}
		},
		"SCR": {
			"name": "Seychelles Rupee",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₨",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"SDG": {
			"name": "Sudanese Pound",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"SEK": {
			"name": "Swedish Krona",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "kr",
				"template": "1 $",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"SGD": {
			"name": "Singapore Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "S$",
				"template": "$1",
				"rtl": false
			}
		},
		"SHP": {
			"name": "Saint Helen Pound",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "£",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"SLL": {
			"name": "Leone",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"SOS": {
			"name": "Somali Shilling",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "S",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "S",
				"template": "$1",
				"rtl": false
			}
		},
		"SRD": {
			"name": "Surinam Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"SSP": {
			"name": "South Sudanese Pound",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"STD": {
			"name": "Dobra",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"SVC": {
			"name": "El Salvador Colon",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "C",
				"template": "$1",
				"rtl": false
			}
		},
		"SYP": {
			"name": "Syrian Pound",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "£",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": ".ل.س",
				"template": "1 $",
				"rtl": true
			}
		},
		"SZL": {
			"name": "Lilangeni",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"THB": {
			"name": "Baht",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "฿",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "฿",
				"template": "$1",
				"rtl": false
			}
		},
		"TJS": {
			"name": "Somoni",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"TMT": {
			"name": "Turkmenistan New Manat",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"TND": {
			"name": "Tunisian Dinar",
			"fractionSize": 3,
			"symbol": {
				"grapheme": ".د.ت",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": {
				"grapheme": ".د.ت",
				"template": "1 $",
				"rtl": true
			}
		},
		"TOP": {
			"name": "Pa’anga",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"TRL": {
			"name": "Turkish Lira",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₤",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": null
		},
		"TRY": {
			"name": "Turkish Lira",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₺",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₺",
				"template": "$1",
				"rtl": false
			}
		},
		"TTD": {
			"name": "Trinidad and Tobago Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "TT$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "TT$",
				"template": "$1",
				"rtl": false
			}
		},
		"TWD": {
			"name": "New Taiwan Dollar",
			"fractionSize": 0,
			"symbol": {
				"grapheme": "NT$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "NT$",
				"template": "$1",
				"rtl": false
			}
		},
		"TZS": {
			"name": "Tanzanian Shilling",
			"fractionSize": 0,
			"symbol": {
				"grapheme": "TSh",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "TSh",
				"template": "$1",
				"rtl": false
			}
		},
		"UAH": {
			"name": "Hryvnia",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "₴",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₴",
				"template": "$1",
				"rtl": false
			}
		},
		"UGX": {
			"name": "Ugand Shilling",
			"fractionSize": 0,
			"symbol": {
				"grapheme": "USh",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "USh",
				"template": "$1",
				"rtl": false
			}
		},
		"USD": {
			"name": "US Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			}
		},
		"USN": {
			"name": "US Dollar (Next day)",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"UYI": {
			"name": "Uruguay Peso en Unidades Indexadas (URUIURUI)",
			"fractionSize": 0,
			"symbol": null,
			"uniqSymbol": null
		},
		"UYU": {
			"name": "Peso Uruguayo",
			"fractionSize": 0,
			"symbol": {
				"grapheme": "$U",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "$U",
				"template": "$1",
				"rtl": false
			}
		},
		"UZS": {
			"name": "Uzbekistan Sum",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "so’m",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "so’m",
				"template": "$1",
				"rtl": false
			}
		},
		"VEF": {
			"name": "Bolivar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "Bs",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "Bs",
				"template": "$1",
				"rtl": false
			}
		},
		"VND": {
			"name": "Dong",
			"fractionSize": 0,
			"symbol": {
				"grapheme": "₫",
				"template": "1 $",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "₫",
				"template": "1 $",
				"rtl": false
			}
		},
		"VUV": {
			"name": "Vatu",
			"fractionSize": 0,
			"symbol": null,
			"uniqSymbol": null
		},
		"WST": {
			"name": "Tala",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"XAF": {
			"name": "CF Franc BEAC",
			"fractionSize": 0,
			"symbol": null,
			"uniqSymbol": null
		},
		"XCD": {
			"name": "East Caribbean Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "EC$",
				"template": "$1",
				"rtl": false
			}
		},
		"XDR": {
			"name": "SDR (Special Drawing Right)",
			"fractionSize": 0,
			"symbol": null,
			"uniqSymbol": null
		},
		"XOF": {
			"name": "CF Franc BCEAO",
			"fractionSize": 0,
			"symbol": null,
			"uniqSymbol": null
		},
		"XPF": {
			"name": "CFP Franc",
			"fractionSize": 0,
			"symbol": null,
			"uniqSymbol": null
		},
		"XSU": {
			"name": "Sucre",
			"fractionSize": 0,
			"symbol": null,
			"uniqSymbol": null
		},
		"XUA": {
			"name": "ADB Unit of Account",
			"fractionSize": 0,
			"symbol": null,
			"uniqSymbol": null
		},
		"YER": {
			"name": "Yemeni Rial",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "﷼",
				"template": "1 $",
				"rtl": true
			},
			"uniqSymbol": {
				"grapheme": ".ر.ي",
				"template": "1 $",
				"rtl": true
			}
		},
		"ZAR": {
			"name": "Rand",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "R",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "R",
				"template": "$1",
				"rtl": false
			}
		},
		"ZMW": {
			"name": "Zambian Kwacha",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		},
		"ZWD": {
			"name": "Zimbabwe Dollar",
			"fractionSize": 2,
			"symbol": {
				"grapheme": "Z$",
				"template": "$1",
				"rtl": false
			},
			"uniqSymbol": {
				"grapheme": "Z$",
				"template": "$1",
				"rtl": false
			}
		},
		"ZWL": {
			"name": "Zimbabwe Dollar",
			"fractionSize": 2,
			"symbol": null,
			"uniqSymbol": null
		}
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// Copied and adapted from underscore.string
	// https://github.com/epeli/underscore.string/blob/2f78f0d6e36d553484a1bf5fe5ed1998f013dea5/numberFormat.js
	var numberFormat = exports.numberFormat = function numberFormat(number, dec, dsep, tsep) {
	  if (isNaN(number) || number == null) return '';
	
	  // eslint-disable-next-line no-bitwise
	  var numberStr = number.toFixed(~~dec);
	  var groupSep = typeof tsep === 'string' ? tsep : ',';
	
	  var parts = numberStr.split('.');
	  var fnums = parts[0];
	  var decimals = parts[1] ? '' + (dsep || '.') + parts[1] : '';
	
	  return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + groupSep) + decimals;
	};
	
	var formatDigits = exports.formatDigits = function formatDigits(number) {
	  var fractionSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
	  return numberFormat(number, fractionSize, '.', ',');
	};
	
	var isNumeric = exports.isNumeric = function isNumeric(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=money-formatter.js.map