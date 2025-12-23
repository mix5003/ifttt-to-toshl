import {expect} from 'chai';
import {UChooseExtractor} from '../src/extractor/uchoose.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('UChoose Extractor', () => {
  let extractor = new UChooseExtractor([{digit: "9210", account: "1234"}, {digit: "1226", account: "4321"}])

  it('should return correct value from expense transaction transaction', () => {
    const result = extractor.extract('SPENDING [KRUNGSRI NOW PLATINUM CREDIT CARD] ขอบคุณที่ใช้บัตร X-9210@XXXXX ยอด 10 บาท');
    expect(result).to.contain({
      accountId: "1234",
      amount: -10,
      type: 'EXPENSE',
      currency: 'THB',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from expense transaction USD currency transaction', () => {
    const result = extractor.extract('SPENDING [KRUNGSRI NOW PLATINUM CREDIT CARD] ขอบคุณที่ใช้บัตร X-9210@PAYPAL *YOSTAR ยอด 4.99 ดอลลาร์สหรัฐ');
    expect(result).to.contain({
      accountId: "1234",
      amount: -4.99,
      type: 'EXPENSE',
      currency: 'USD',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from expense transaction USD currency transaction correct card', () => {
    const result = extractor.extract('SPENDING [KRUNGSRI NOW PLATINUM CREDIT CARD] ขอบคุณที่ใช้บัตร X-1226@XXXXX ยอด 10.10 ดอลลาร์สหรัฐ');
    expect(result).to.contain({
      accountId: "4321",
      amount: -10.10,
      type: 'EXPENSE',
      currency: 'USD',
      category: 'Uncategorized'
    });
  });

    it('should return correct value from expense transaction JPY currency transaction', () => {
    const result = extractor.extract('SPENDING [KRUNGSRI NOW PLATINUM CREDIT CARD] ขอบคุณที่ใช้บัตร X-9210@PIXIVFANBOX ยอด 500.00 เยน');
    expect(result).to.contain({
      accountId: "1234",
      amount: -500,
      type: 'EXPENSE',
      currency: 'JPY',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from expense transaction unknown currency transaction', () => {
    const result = extractor.extract('SPENDING [KRUNGSRI NOW PLATINUM CREDIT CARD] ขอบคุณที่ใช้บัตร X-9210@XXXXX ยอด 10.10 blablabla');
    expect(result).to.contain({
      accountId: "1234",
      amount: -10.10,
      type: 'EXPENSE',
      currency: 'THB',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from cashback transaction transaction', () => {
    const result = extractor.extract('CARD BENEFIT [KRUNGSRI NOW PLATINUM CREDIT CARD] คุณได้รับเครดิตเงินคืน 25.00 บาท จากรายการ เครดิตเงินคืน 5% หมวดออนไลน์ ผ่านบัตรเครดิต Krungsri NOW จากยอดใช้จ่ายที่ PAYPAL *YOSTAR วันที่ 23/12/2025');
    expect(result).to.contain({
      accountId: "1234", // TODO: only support default card??
      amount: 25,
      type: 'INCOME',
      currency: 'THB',
      category: 'CashBack'
    });
  });

  
});
