import Transaction from "../transaction";
import {BaseExtractor} from "./extractor";

export class TrueMoneyExtractor extends BaseExtractor {
    extract(text: string): Transaction | null {
        if (text.includes('ชำระเงิน')) {
            const result = text.match('ชำระเงิน\\s*([-.,0-9]+)\\s*บ.');
            let category = 'Uncategorized';
            if (text.includes('7-ELEVEN')) {
                category = 'Food'
            }
            if (result) {
                return {
                    accountId: this.accountId,
                    amount: -1 * +(result[1].replace(/,/g, '')),
                    type: 'EXPENSE',
                    category
                }
            }
        } else if (text.includes('You have added ')) {
            const result = text.match('You have added\\s*([-.,0-9]+)\\s*Baht');
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
