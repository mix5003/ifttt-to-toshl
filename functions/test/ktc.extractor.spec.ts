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

  it('should return correct value from MRT transaction via credit card', () => {
    const result = extractor.extract('รายการใช้จ่าย บัตร KTC X-6099 ยอด 82.00 THB @MRT-BEM                  Bangkok      TH');
    expect(result).to.contain({
      accountId: "4321",
      amount: -82,
      type: 'EXPENSE',
      currency: 'THB',
      category: 'Travel',
    });
    expect(result.tags).to.have.lengthOf(1);
    expect(result.tags[0]).to.eq('MRT');
  });

  it('should return correct value from BTS transaction via credit card', () => {
    const result = extractor.extract('รายการใช้จ่าย กําลังดําเนินการรายการผ่านบัตร KTC X-6099 ยอด 48.00 THB @LINEPAY*BTS01            281786908    TH');
    expect(result).to.contain({
      accountId: "4321",
      amount: -48,
      type: 'EXPENSE',
      currency: 'THB',
      category: 'Travel',
    });
    expect(result.tags).to.have.lengthOf(1);
    expect(result.tags[0]).to.eq('BTS');
  });

  it('should return correct value from BTS-2 transaction via credit card', () => {
    const result = extractor.extract('รายการใช้จ่าย บัตร KTC X-6099 ยอด 50.00 THB @LINEPAY*BTSFARE          281786908    TH');
    expect(result).to.contain({
      accountId: "4321",
      amount: -50,
      type: 'EXPENSE',
      currency: 'THB',
      category: 'Travel',
    });
    expect(result.tags).to.have.lengthOf(1);
    expect(result.tags[0]).to.eq('BTS');
  });

  it('should return correct value from Bus transaction via credit card', () => {
    const result = extractor.extract('รายการใช้จ่าย บัตร KTC X-6099 ยอด 13.00 THB @BMTA ZONE 6 GROUP 1      NAKHON PATHOMTH');
    expect(result).to.contain({
      accountId: "4321",
      amount: -13,
      type: 'EXPENSE',
      currency: 'THB',
      category: 'Travel',
    });
    expect(result.tags).to.have.lengthOf(1);
    expect(result.tags[0]).to.eq('Bus');
  });
});
