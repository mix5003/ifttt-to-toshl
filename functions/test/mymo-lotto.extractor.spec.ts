import {expect} from 'chai';
import {MyMoExtractor} from '../src/extractor/mymo-lotto.extractor';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('MyMo Extractor', () => {
  const extractor = new MyMoExtractor("1234");

  it('should return correct value from lotto win transaction', () => {
    const result = extractor.extract('คุณถูกรางวัลสลากเป็นจำนวนเงิน 150.00 บาท');
    expect(result).to.contain({
      accountId: "1234",
      amount: 150,
      type: 'INCOME',
      category: 'สลากออมสิน'
    });
  });
});
