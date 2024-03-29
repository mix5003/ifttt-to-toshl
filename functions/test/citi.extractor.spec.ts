import {expect} from 'chai';
import {CitiExtractor} from '../src/extractor/citi.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('Citi Extractor', () => {
  let extractor = new CitiExtractor([{digit: "2737", account: "1234"}, {digit: "1226", account: "4321"}])

  it('should return correct value from expense transaction', () => {
    const result = extractor.extract('ขอบคุณที่ใช้จ่าย 714  บาท ผ่านบัตรเครดิตซิตี้เลขท้าย 2737  ผ่าน xxxx   โปรโมชั่นพิเศษสำหรับการแลกคะแนนสะสมซิตี้ รีวอร์ดเพื่อรับเครดิตเงินคืน คลิก opp โปรโมชั่นนี้มีอายุ 24 ชั่วโมง หลังจากได้รับข้อความนี้เท่านั้น');
    expect(result).to.contain({
      accountId: "1234",
      amount: -714,
      type: 'EXPENSE',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from grab transaction', () => {
    const result = extractor.extract('ขอบคุณที่ใช้จ่าย 714 บาท ผ่านบัตรเครดิตซิตี้เลขท้าย 2737 ผ่าน Grab  โปรโมชั่นพิเศษ...');
    expect(result).to.contain({
      accountId: "1234",
      amount: -714,
      type: 'EXPENSE',
      category: 'Travel'
    });
    expect(result.tags).to.have.lengthOf(1);
    expect(result.tags[0]).to.eq('Taxi');
  });

  it('should return correct value from online expense transaction', () => {
    const result = extractor.extract('Online Transaction amount JPY960.0 on credit card no. 2737');
    expect(result).to.contain({
      accountId: "1234",
      amount: -960,
      type: 'EXPENSE',
      currency: 'JPY',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from online charged expense transaction', () => {
    const result = extractor.extract('Your Credit Card ending 2737 has been charged USD 37.00 on 02 Dec. - ');
    expect(result).to.contain({
      accountId: "1234",
      amount: -37,
      type: 'EXPENSE',
      currency: 'USD',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from offline charged expense transaction', () => {
    const result = extractor.extract('Your Citi Credit Card ending 2737 has been charged THB 1,845.00 on 31-Oct at AIA THAILANDT003. - ');
    expect(result).to.contain({
      accountId: "1234",
      amount: -1845,
      type: 'EXPENSE',
      currency: 'THB',
      category: 'Uncategorized'
    });
  });

  it('should return correct value from income transaction', () => {
    const result = extractor.extract('ธนาคารซิตี้แบงค์ขอบพระคุณที่ชำระยอด 3,000.0 บ. สำหรับบัตรเครดิตที่ลงท้ายด้วย 2737 เมื่อวันที่ 01-Apr-21');
    expect(result).to.contain({
      accountId: "1234",
      amount: 3000,
      type: 'INCOME',
      category: 'Uncategorized'
    });
  });

  it('should return correct card from offline charged expense transaction', () => {
    const result = extractor.extract('Your Citi Credit Card ending 1226 has been charged THB 1,845.00 on 31-Oct at AIA THAILANDT003. - ');
    expect(result).to.contain({
      accountId: "4321",
      amount: -1845,
      type: 'EXPENSE',
      currency: 'THB',
      category: 'Uncategorized'
    });
  });

  it('should return null when can not match transaction', () => {
    const result = extractor.extract('สมัครบัตรเดบิตเรียบร้อยแล้ว');
    expect(result).to.null;
  });
});
