import { expect } from 'chai';
import extractor from '../src/extractor/mymo-lotto.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('MyMo Extractor', () => {
  it('should return correct value from lotto win transaction', () => {
    const result = extractor('คุณถูกรางวัลสลากเป็นจำนวนเงิน 150.00 บาท');
    expect(result).to.contain({
      amount: 150,
      type: 'INCOME',
      category: 'สลากออมสิน'
    });
  });
});