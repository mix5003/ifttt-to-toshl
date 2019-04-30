import { expect } from 'chai';
import extractor from '../src/extractor/k-plus.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('K PLUS Extractor', () => {
  it('should return correct value from transfer transaction', () => {
    const result = extractor('รายการโอน/ถอน บัญชี xxx-x-x3060-x จำนวนเงิน -300.00 บาท วันที่ 30 พ.ย. 61 10:37 น.');
    expect(result).to.contain({
      amount: -300,
      type: 'EXPENSE',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from income transaction', () => {
    const result = extractor('รายการเงินเข้า บัญชี xxx-x-x3060-x จำนวนเงิน 300.00 บาท วันที่ 30 พ.ย. 61 10:37 น.');
    expect(result).to.contain({
      amount: 300,
      type: 'INCOME',
      category: 'Uncategorized'
    });
  });

  it('should return null when can not match transaction', () => {
    const result = extractor('สมัครบัตรเดบิตเรียบร้อยแล้ว');
    expect(result).to.null;
  });
});