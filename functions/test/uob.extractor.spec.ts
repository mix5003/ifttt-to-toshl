import {expect} from 'chai';
import {UOBExtractor} from '../src/extractor/uob.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('UOB Extractor', () => {
  let extractor = new UOBExtractor([{digit: "2737", account: "1234"}, {digit: "1226", account: "4321"}])

  it('should return correct value from expense transaction', () => {
    const result = extractor.extract('UOB : ขอบคุณ ท่านใช้บัตร X-1226 = 59.00 THB/ 02-285-1573 - UOBT');
    expect(result).to.contain({
      accountId: "4321",
      amount: -59,
      type: 'EXPENSE',
      currency: 'THB',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from expense other currency transaction', () => {
    const result = extractor.extract('UOB : ขอบคุณ ท่านใช้บัตรเสริม X-2737 = 0.99 USD/ 02-285-1573 - UOBT');
    expect(result).to.contain({
      accountId: "1234",
      amount: -0.99,
      type: 'EXPENSE',
      currency: 'USD',
      category: 'Uncategorized'
    });
  });

  it('should return null when can not match transaction', () => {
    const result = extractor.extract('สมัครบัตรเดบิตเรียบร้อยแล้ว');
    expect(result).to.null;
  });
});
