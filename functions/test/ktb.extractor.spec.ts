import {expect} from 'chai';
import {KTBExtractor} from '../src/extractor/ktb.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('KTB Extractor', () => {
  const extractor = new KTBExtractor([{digit: "XXX-X-XX162-4", account: "1234"}, {digit: "XXX-X-XX162-5", account: "4321"}]);

  it('should return correct value from expense transaction', () => {
    const result = extractor.extract('โอนเงินสำเร็จ โอนเงินออก -20.00 บาท จากบัญชี XXX-X-XX162-4 ไปยังพร้อมเพย์ XXXXXXXXXXX5697');
    expect(result).to.contain({
      accountId: "1234",
      amount: -20,
      type: 'EXPENSE',
      currency: 'THB',
      category: 'Food'
    });
  });

  it('should return correct value from expense transaction correct account', () => {
    const result = extractor.extract('โอนเงินสำเร็จ โอนเงินออก -20.00 บาท จากบัญชี XXX-X-XX162-5 ไปยังพร้อมเพย์ XXXXXXXXXXX5697');
    expect(result).to.contain({
      accountId: "4321",
      amount: -20,
      type: 'EXPENSE',
      currency: 'THB',
      category: 'Food'
    });
  });

  it('should return correct value from income transaction', () => {
    const result = extractor.extract('รับเงินสำเร็จ ได้รับ +50.00 บาท เข้าบัญชี XXX-X-XX162-4 จากบัญชี กสิกรไทย XXX-X-XX060-9');
    expect(result).to.contain({
      accountId: "1234",
      amount: 50,
      type: 'INCOME',
      currency: 'THB',
      category: 'Food',
    });
  });

  it('should return correct value from income transaction correct account', () => {
    const result = extractor.extract('รับเงินสำเร็จ ได้รับ +50.00 บาท เข้าบัญชี XXX-X-XX162-5 จากบัญชี กสิกรไทย XXX-X-XX060-9');
    expect(result).to.contain({
      accountId: "4321",
      amount: 50,
      type: 'INCOME',
      currency: 'THB',
      category: 'Food',
    });
  });
});
