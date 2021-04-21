import Transaction from "../transaction";
import {BaseExtractor} from "./extractor";

export class MyMoExtractor extends BaseExtractor {
    extract(text: string): Transaction | null {
        if (text.includes('คุณถูกรางวัลสลากเป็นจำนวนเงิน')) {
            const result = text.match('คุณถูกรางวัลสลากเป็นจำนวนเงิน\\s*([-.,0-9]+)\\s*บาท');
            if (result) {
                return {
                    accountId: this.accountId,
                    amount: +(result[1].replace(/,/g, '')),
                    type: 'INCOME',
                    category: 'สลากออมสิน',
                }
            }
        }
        return null;
    }
}
