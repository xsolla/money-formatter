import moneyFormatter, {
  format,
  formatToHTML,
  formatSimple,
} from '../../src/money-formatter';

import { getTextContent, errorArgs } from '../_test-utils';

describe('moneyFormatter', () => {
  describe('format', () => {
    it('should apply basic formatting', () => {
      expect(format('USD', 42)).to.equal('$42.00');
    });

    it('should use default currency number of digits in fraction', () => {
      expect(format('TND', 1)).to.equal('1.000 .د.ت');
    });

    it('should round to n digits after dot', () => {
      expect(format('USD', 1.2345, 3)).to.equal('$1.234');
      expect(format('USD', 1.23456, 4)).to.equal('$1.2346');
    });

    it('should allow 0 fraction digits', () => {
      expect(format('USD', 0.99, 0)).to.equal('$1');
      expect(format('USD', 10, 0, true)).to.equal('10 USD');
    });

    it('should group digits', () => {
      expect(format('USD', 1234567)).to.equal('$1,234,567.00');
    });

    it('should return empty string if code and amount aren\'t provided', () => {
      expect(format()).to.equal('');
    });

    it('should return empty string if amount is not a proper number', () => {
      expect(format('USD', 'test')).to.equal('');
      // NaN is not a valid currency amount
      expect(format('USD', NaN)).to.equal('');
      expect(format('USD', undefined)).to.equal('');
      expect(format({ test: 1 }, 10)).to.equal('');
    });

    it('should return empty string if currency is not a string', () => {
      expect(format({ name: 'USD', grapheme: '$' }, 10)).to.equal('');
    });

    it('should put minus sign before the other parts', () => {
      // Note that it's the minus sign (U+2212) and not
      // the hyphen-minus (U+002D) from ASCII
      expect(format('USD', -42)).to.equal('−$42.00');
    });

    it('should position currency signs according to rules', () => {
      expect(format('USD', 10)).to.equal('$10.00');
      expect(format('RUR', 10)).to.equal('10.00 ₽');
      expect(format('PYG', 10, 2)).to.equal('10.00Gs');
    });

    it('should handle arbitrary non-ISO4217 currencies', () => {
      expect(format('gold', 10)).to.equal('10.00 gold');
    });

    it('should format with simple alphabetic codes', () => {
      expect(format('USD', 10, undefined, true)).to.equal('10.00 USD');
    });

    it('shouldn\'t throw nonsensical error null and undefined in required args', () => {
      errorArgs.forEach((args) => {
        expect(() => format(...args), `format with args: ${JSON.stringify(args)}`)
        .to.not.throw(Error);
      });
    });

    it('should handle official currencies without `symbol` or `uniqSymbol` data', () => {
      expect(format('MDL', 123.45)).to.equal('123.45 MDL');
    });

    // TODO: Support rtl currencies for string formatting
    // Right now it's not supported, because it will break HTML formatting
    it.skip('should support rtl currencies', () => {
      expect(format('SAR', 10)).to.equal('﷼ 10.00');
      expect(format('SAR', -10)).to.equal('﷼ 10.00-');
    });
  });

  describe('formatToHTML', () => {
    it('should set direction attributes for proper bidirectional output', () => {
      expect(formatToHTML('SAR', 10)).to.equal('<span dir="rtl">10.00 ﷼</span>');
      expect(formatToHTML('USD', 10)).to.equal('<span dir="ltr">$10.00</span>');
    });

    it('should not modify original formatting', () => {
      const htmlTextContent = getTextContent(formatToHTML('SAR', 10));
      const originalText = format('SAR', 10);
      expect(htmlTextContent).to.equal(originalText);
    });

    it('should handle non-currencies', () => {
      expect(formatToHTML('gold', 10)).to.equal('<span dir="ltr">10.00 gold</span>');
    });

    it('should not change position of currency symbol inside string', () => {
      // Mock currencies data
      moneyFormatter.__Rewire__('currencyFormatData', {
        __RTL: {
          symbol: {
            grapheme: '$',
            template: '1 $',
            rtl: true,
          },
        },
        __LTR: {
          symbol: {
            grapheme: '$',
            template: '1 $',
            rtl: false,
          },
        },
      });
      expect(formatToHTML('__RTL', 10)).to.not.equal(formatToHTML('__LTR', 10));
      expect(getTextContent(formatToHTML('__RTL', 10)))
        .to.equal(getTextContent(formatToHTML('__LTR', 10)));
      moneyFormatter.__ResetDependency__('currencyFormatData');
    });

    it('shouldn\'t throw nonsensical error null and undefined in required args', () => {
      errorArgs.forEach((args) => {
        expect(() => formatToHTML(...args), `format with args: ${JSON.stringify(args)}`)
        .to.not.throw(Error);
      });
    });

    it('should handle official currencies without `symbol` or `uniqSymbol` data', () => {
      expect(formatToHTML('MDL', 123.45)).to.equal('<span dir="ltr">123.45 MDL</span>');
    });
  });

  describe('formatSimple', () => {
    it('should not format currency codes', () => {
      expect(formatSimple('USD', 42)).to.equal('42.00 USD');
    });

    it('should keep minus sign', () => {
      expect(formatSimple('USD', -10)).to.equal('-10.00 USD');
    });

    it('should round to n digits after dot', () => {
      expect(formatSimple('USD', 1.2345, 3)).to.equal('1.234 USD');
      expect(formatSimple('USD', 1.23456, 4)).to.equal('1.2346 USD');
    });

    it('shouldn\'t throw nonsensical error null and undefined in required args', () => {
      errorArgs.forEach((args) => {
        expect(() => formatSimple(...args), `format with args: ${JSON.stringify(args)}`)
        .to.not.throw(Error);
      });
    });
  });

  it('exports both full module and inidividual functions', () => {
    expect(moneyFormatter.format).to.equal(format);
  });
});
