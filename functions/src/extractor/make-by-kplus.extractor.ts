import Transaction from "../transaction";
import {TransactionExtractor} from "./extractor";

export class MakeByKPlusExtractor implements TransactionExtractor {
    constructor(protected accountId: string) {
    }

    getAccountId(text: string): string {
        return this.accountId;
    }

    extract(text: string): Transaction | null {
        const accountId = this.getAccountId(text);

        if (text.includes('คุณโอน')) {

            const result = text.match('คุณโอน\\s*฿([-.,0-9]+)\\s*ให้');
            if (result) {
                let value = +(result[1].replace(/,/g, ''));
                if(value > 0){
                    value = -value;
                }
                return {
                    accountId: accountId,
                    amount: value,
                    type: 'EXPENSE',
                    category: 'Food'
                }
            }
        } else if (text.includes('คุณได้รับเงิน')) {
            const result = text.match('คุณได้รับเงิน\\s*฿([-.,0-9]+)\\s*จาก');
            if (result) {
                return {
                    accountId: accountId,
                    amount: +(result[1].replace(/,/g, '')),
                    type: 'INCOME',
                    category: 'Uncategorized'
                }
            }
        }
        return null;
    }
}
