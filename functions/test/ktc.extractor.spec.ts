import {expect} from 'chai';
import {KTCExtractor} from '../src/extractor/ktc.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('KTC Extractor', () => {
  const extractor = new KTCExtractor([{digit: "1452", account: "1234"}, {digit: "6099", account: "4321"}]);

  it('should return correct value from expense transaction', () => {
    const result = extractor.extract('ขอบคุณที่ใช้บัตรKTC X-1452  ยอด 19.99 USD @PAYPAL *YOSTAR');
    expect(result).to.contain({
      accountId: "1234",
      amount: -19.99,
      type: 'EXPENSE',
      currency: 'USD',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from expense transaction correct card', () => {
    const result = extractor.extract('ขอบคุณที่ใช้บัตรKTC X-6099  ยอด 19.99 USD @PAYPAL *YOSTAR');
    expect(result).to.contain({
      accountId: "4321",
      amount: -19.99,
      type: 'EXPENSE',
      currency: 'USD',
      category: 'Uncategorized'
    });
  });
});
