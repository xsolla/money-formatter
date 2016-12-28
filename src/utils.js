// Copied and adapted from underscore.string
// https://github.com/epeli/underscore.string/blob/2f78f0d6e36d553484a1bf5fe5ed1998f013dea5/numberFormat.js
export const numberFormat = (number, dec, dsep, tsep) => {
  if (isNaN(number) || number == null) return '';

  // eslint-disable-next-line no-bitwise
  const numberStr = number.toFixed(~~dec);
  const groupSep = typeof tsep === 'string' ? tsep : ',';

  const parts = numberStr.split('.');
  const fnums = parts[0];
  const decimals = parts[1] ? `${dsep || '.'}${parts[1]}` : '';

  return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, `$1${groupSep}`) + decimals;
};

export const formatDigits = (number, fractionSize = 2) =>
  numberFormat(number, fractionSize, '.', ',');

export const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);
