import { expect } from 'chai';
import extractor from '../src/extractor/ktc.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('KTC Extractor', () => {
  it('should return correct value from expense transaction', () => {
    const result = extractor('ขอบคุณที่ใช้บัตรKTC X-1452  ยอด 19.99 USD @PAYPAL *YOSTAR');
    expect(result).to.contain({
      amount: -19.99,
      type: 'EXPENSE',
      currency: 'USD',
      category: 'Uncategorized'
    });
  });
});