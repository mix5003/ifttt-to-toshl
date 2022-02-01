import {expect} from 'chai';
import {KPlusExtractor} from '../src/extractor/k-plus.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('K PLUS Extractor', () => {
  const extractor = new KPlusExtractor([{digit: "bank", account: "1234"}, {digit: "6099", account: "4321"}])

  it('should return correct value from transfer transaction', () => {
    const result = extractor.extract('รายการโอน/ถอน บัญชี xxx-x-x3060-x จำนวนเงิน -300.00 บาท วันที่ 30 พ.ย. 61 10:37 น.');
    expect(result).to.contain({
      accountId: "1234",
      amount: -300,
      type: 'EXPENSE',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from transfer transaction', () => {
    const result = extractor.extract('รายการโอน/ถอน บัญชี xxx-x-x3060-x จำนวนเงิน 300.00 บาท วันที่ 30 พ.ย. 61 10:37 น.');
    expect(result).to.contain({
      accountId: "1234",
      amount: -300,
      type: 'EXPENSE',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from income transaction', () => {
    const result = extractor.extract('รายการเงินเข้า บัญชี xxx-x-x3060-x จำนวนเงิน 300.00 บาท วันที่ 30 พ.ย. 61 10:37 น.');
    expect(result).to.contain({
      accountId: "1234",
      amount: 300,
      type: 'INCOME',
      category: 'Uncategorized'
    });
  });

  it('should return correct account from credit card transaction', () => {
    const result = extractor.extract('รายการใช้บัตร หมายเลขบัตร xxxx-xxxx-xxxx-6099 จำนวนเงิน 1,000.00 บาท ที่ HTTPS://K-INVEST.KASIKORN');
    expect(result).to.contain({
      accountId: "4321",
      amount: -1000,
      type: 'EXPENSE',
      category: 'Uncategorized'
    });
  });

  it('should return null when can not match transaction', () => {
    const result = extractor.extract('สมัครบัตรเดบิตเรียบร้อยแล้ว');
    expect(result).to.null;
  });
});
