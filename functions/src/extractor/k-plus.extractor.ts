import Transaction from "../transaction";
import {BaseExtractor} from "./extractor";

export class KPlusExtractor extends BaseExtractor {
    extract(text: string): Transaction | null {
        if (text.includes('รายการโอน/ถอน')) {
            const result = text.match('จำนวนเงิน\\s*([-.,0-9]+)\\s*บาท');
            if (result) {
                return {
                    accountId: this.accountId,
                    amount: +(result[1].replace(/,/g, '')),
                    type: 'EXPENSE',
                    category: 'Uncategorized'
                }
            }
        } else if (text.includes('รายการเงินเข้า')) {
            const result = text.match('จำนวนเงิน\\s*([-.,0-9]+)\\s*บาท');
            if (result) {
                return {
                    accountId: this.accountId,
                    amount: +(result[1].replace(/,/g, '')),
                    type: 'INCOME',
                    category: 'Uncategorized'
                }
            }
        }
        return null;
    }
}
