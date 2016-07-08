import { numberFormat } from '../../src/utils';

describe('Utils', () => {
  describe('numberFormat', () => {
    it('should use default group separator when not provided', () => {
      expect(numberFormat(1000, 2, '.')).to.equal('1,000.00');
    });

    it('should use default decimal separator when not provided', () => {
      expect(numberFormat(1, 2, undefined, ',')).to.equal('1.00');
    });
  });
});
