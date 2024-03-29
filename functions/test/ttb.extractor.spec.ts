import {expect} from 'chai';
import {TTBExtractor} from '../src/extractor/ttb.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('TTB Extractor', () => {
  let extractor = new TTBExtractor([{digit: "2737", account: "1234"}, {digit: "5678", account: "4321"}])

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

  it('should return correct value from 7-11 transaction', () => {
    const result = extractor.extract('ท่านใช้จ่าย 43.00 THB ที่ TMN 7-11                 BANGKOK      TH ผ่านบัตรเครดิต ทีทีบี หมายเลข xx2737 (14/11/2022@15:05) หากมีข้อสงสัยโทร 1428');
    // duplicate true money
    expect(result).to.be.null
  });

  it('should return correct value from food transaction', () => {
    const result = extractor.extract('ท่านใช้จ่าย 45.00 THB ที่ TMN FAST FOOD            BANGKOK      TH ผ่านบัตรเครดิต ทีทีบี หมายเลข xx2737 (14/11/2022@14:47) หากมีข้อสงสัยโทร 1428');
    expect(result).to.contain({
      accountId: "1234",
      amount: -45,
      type: 'EXPENSE',
      currency: 'THB',
      category: 'Food'
    });
  });

  it('should return correct value from cashback transaction', () => {
    const result = extractor.extract('มีเงิน เงินคืนบัตร โซ สมาร์ท จำนวน 195.71 บ.เข้าบ/ช XX5678. 23/12/22@20:08');
    expect(result).to.contain({
      accountId: "4321",
      amount: 195.71,
      type: 'INCOME',
      currency: 'THB',
      category: 'CashBack'
    });
  });
  
});