import {expect} from 'chai';
import {TTBExtractor} from '../src/extractor/ttb.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('TTB Extractor', () => {
  let extractor = new TTBExtractor([{digit: "2737", account: "1234"}])

  it('should return correct value from expense transaction', () => {
    const result = extractor.extract('ท่านใช้จ่าย 70 THB ที่ PAYPAL HK ผ่านบัตรเครดิต ทีทีบี หมายเลข xx2737 (11/11/2022@23:46) หากมีข้อสงสัย โทร 1428');
    expect(result).to.contain({
      accountId: "1234",
      amount: -70,
      type: 'EXPENSE',
      currency: 'THB',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from expense transaction other currency', () => {
    const result = extractor.extract('ท่านใช้จ่าย .99 USD ที่ PAYPAL HK ผ่านบัตรเครดิต ทีทีบี หมายเลข xx2737 (11/11/2022@23:46) หากมีข้อสงสัย โทร 1428');
    expect(result).to.contain({
      accountId: "1234",
      amount: -0.99,
      type: 'EXPENSE',
      currency: 'USD',
      category: 'Uncategorized'
    });
  });
});