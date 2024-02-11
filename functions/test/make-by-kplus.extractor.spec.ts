import {expect} from 'chai';
import {MakeByKPlusExtractor} from '../src/extractor/make-by-kplus.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('Make By K PLUS Extractor', () => {
  const extractor = new MakeByKPlusExtractor("1234")
  
  it('should return correct value from transfer transaction', () => {
    const result = extractor.extract("💸 คุณโอน ฿20.00 ให้ นาย ...; ");
    expect(result).to.contain({
      accountId: "1234",
      amount: -20,
      type: 'EXPENSE',
      category: 'Food'
    });
  });

  it('should return correct value from transfer transaction', () => {
    const result = extractor.extract('💰 คุณได้รับเงิน ฿20.00 จาก นาย ... ด้วย ธนาคารกสิกรไทย');
    expect(result).to.contain({
      accountId: "1234",
      amount: 300,
      type: 'INCOME',
      category: 'Uncategorized'
    });
  });

  it('should return null when can not match transaction', () => {
    const result = extractor.extract('สมัครบัตรเดบิตเรียบร้อยแล้ว');
    expect(result).to.null;
  });
});
