// eslint-disable-next-line import/no-extraneous-dependencies,import/extensions
import currencyFormatData from 'currency-format';
import { formatDigits, isNumeric } from './utils';

const getCurrencyData = code => currencyFormatData[code.toUpperCase()];

export const formatSimple = (currencyName, amount, fractionSize) =>
  `${formatDigits(amount, fractionSize)} ${currencyName}`;

/**
 * Return true if arguments are valid
 */
const validateCurrencyArgs = (currencyCode, amount) =>
  typeof currencyCode === 'string' && isNumeric(amount);

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
export const format = (currencyCode, amount, fractionSize, useAlphaCode) => {
  if (!validateCurrencyArgs(currencyCode, amount)) {
    return '';
  }
  const currency = getCurrencyData(currencyCode);
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

  const symbol = currency.symbol || currency.uniqSymbol;
  // If the alphabetic code was requested instead of standard symbol,
  // we shouldn't use special template and other advanced formatting
  if (useAlphaCode || !symbol) {
    return formatSimple(currencyCode.toUpperCase(), amount, fractionSize);
  }

  const fractionLength = typeof fractionSize === 'undefined'
    ? currency.fractionSize
    : fractionSize;

  // Extract sign to put it before all other parts
  const amountString = formatDigits(Math.abs(amount), fractionLength);
  const signString = amount < 0 ? '−' : '';

  const formattedCurrency = symbol.template
    .replace('1', amountString)
    .replace('$', symbol.grapheme);
  return signString + formattedCurrency;
};

/**
 * Check whether given currency should be left-to-right or right-to-left formatted.
 * @param  {string} currencyCode Code of currency from 'currency-format' library
 * @return {boolean}             true if rtl, else false
 */
const isRTLCurrency = (currencyCode) => {
  const currencyObj = getCurrencyData(currencyCode);
  if (currencyObj) {
    const symbol = currencyObj.symbol || currencyObj.uniqSymbol;
    // If symbol data is found, return it, else mark the currency as 'ltr'
    return symbol ? symbol.rtl : false;
  }
  return false;
};

const currencyHTMLTemplate = (options) => {
  const { formattedCurrency, isRTL } = options;
  return `<span dir="${isRTL ? 'rtl' : 'ltr'}">${formattedCurrency}</span>`;
};

/**
 * Same as `format` but outputs string with HTML element for proper
 * bidirectional output in browsers.
 * This is just decorator of {@link format}
 *
 * @see {@link format} for function arguments
 * @return {string} HTML element with formatted currency as a string
 */
export const formatToHTML = (...args) => {
  const [code, amount] = args;
  if (validateCurrencyArgs(code, amount)) {
    const formattedCurrency = format(...args);
    return currencyHTMLTemplate({
      formattedCurrency,
      isRTL: isRTLCurrency(code),
    });
  }
  return currencyHTMLTemplate({
    formattedCurrency: '',
    isRTL: false,
  });
};

export default {
  format,
  formatSimple,
  formatToHTML,
};
