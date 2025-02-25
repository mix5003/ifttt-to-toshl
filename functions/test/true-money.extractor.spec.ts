import {expect} from 'chai';
import {TrueMoneyExtractor} from '../src/extractor/true-money.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('True Money Extractor', () => {
  const extractor = new TrueMoneyExtractor([{digit: "wallet", account: "1234"}, {digit: "2737", account: "4321"}]);

  it('should return correct value from expense transaction', () => {
    const result = extractor.extract('ชำระเงิน 49.00บ. ให้ ปปป คงเหลือ 573.00บ. (50000000000000)');
    expect(result).to.contain({
      accountId: "1234",
      amount: -49,
      type: 'EXPENSE',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from 7-eleven transaction', () => {
    const result = extractor.extract('ชำระเงิน 49.00บ. ให้ 7-ELEVEN คงเหลือ 573.00บ. (50000000000000)');
    expect(result).to.contain({
      accountId: "1234",
      amount: -49,
      type: 'EXPENSE',
      category: 'Food'
    });
  });

  it('should return correct value from 7-eleven transaction via credit card', () => {
    const result = extractor.extract('คุณได้ชำระเงิน 398.00 บ. ให้ 7-ELEVEN ด้วยบัตรเครดิต / เดบิต **** **** **** 2737');
    expect(result).to.contain({
      accountId: "4321",
      amount: -398,
      type: 'EXPENSE',
      category: 'Food'
    });
  });

  it('should return correct value from 7-eleven transaction via bank', () => {
    const result1 = extractor.extract('จ่ายเงินสำเร็จ คุณจ่ายเงิน ฿ 52.00 ให้ 7-Eleven ด้วยบัญชีธนาคาร ธนาคารไทยพาณิชย์ ******1234');
    expect(result1).to.contain({
      accountId: "1234",
      amount: -52,
      type: 'EXPENSE',
      category: 'Food'
    });

    const result2 = extractor.extract('จ่ายเงินสำเร็จ คุณจ่ายเงิน ฿ 52.00 ให้ 7-Eleven ด้วยบัญชีธนาคาร ธนาคารกสิกรไทย ******1234');
    expect(result2).to.contain({
      accountId: "1234",
      amount: -52,
      type: 'EXPENSE',
      category: 'Food'
    });
  });
  

  it('should return correct value from 7-eleven transaction via credit card 2', () => {
    const result = extractor.extract('TrueMoney Wallet คุณได้ชำระเงิน ฿ 22.00  ให้ 7-Eleven ด้วยบัตรเครดิต / เดบิต 1234 56** **** 2737');
    expect(result).to.contain({
      accountId: "4321",
      amount: -22,
      type: 'EXPENSE',
      category: 'Food'
    });
  });

  it('should return correct value from True Vending Machine transaction via credit card', () => {
    const result = extractor.extract('TrueMoney Wallet คุณได้ชำระเงิน 16.00 บ. ให้ร้าน True Vending Machine');
    expect(result).to.contain({
      accountId: "1234",
      amount: -16,
      type: 'EXPENSE',
      category: 'Food'
    });
  });

  it('should return correct value from 7-eleven transaction via credit card EN', () => {
    const result = extractor.extract('TrueMoney Wallet You have paid 281.00 THB. to 7-ELEVEN. with credit / debit card 4386 79** **** 2737');
    expect(result).to.contain({
      accountId: "4321",
      amount: -281,
      type: 'EXPENSE',
      category: 'Food'
    });
  });

  it('should return correct value from income transaction', () => {
    const result = extractor.extract('You have added 1,000 Baht with TrueMoney Cash Card and service fee was charged for 140 Baht. You balance is 860 Baht (transaction 50000000000000)');
    expect(result).to.contain({
      accountId: "1234",
      amount: 1000,
      type: 'INCOME',
      category: 'Uncategorized'
    });
  });

  it('should return null when can not match transaction', () => {
    const result = extractor.extract('คุณได้สิทธิ์สแกน QR เปิดถุงLuckyBag ที่หน้าร้าน รับเงินคืนสูงสุดทันที 10,000บ.สิทธิ์มีอายุแค่ 1ชม. คลิก');
    expect(result).to.null;
  });
});
