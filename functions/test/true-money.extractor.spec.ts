import {expect} from 'chai';
import {TrueMoneyExtractor} from '../src/extractor/true-money.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('True Money Extractor', () => {
  const extractor = new TrueMoneyExtractor("1234");

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
