import Transaction from "../transaction";
import {TransactionExtractor} from "./extractor";

export class TrueMoneyExtractor implements TransactionExtractor {
    constructor(private cardMap: { digit: string, account: string }[]) {
    }

    getAccountId(text: string): string {
        const card = this.cardMap.find(v => text.indexOf(v.digit) !== -1);
        if (card && text.includes('บัตร')) {
            return card.account;
        }
        return this.cardMap[0].account;
    }

    extract(text: string): Transaction | null {
        if (text.includes('ชำระเงิน')) {
            const result = text.match('ชำระเงิน\\s*([-.,0-9]+)\\s*บ.');
            let category = 'Uncategorized';
            if (text.includes('7-ELEVEN')) {
                category = 'Food'
            }
            if (result) {
                return {
                    accountId: this.getAccountId(text),
                    amount: -1 * +(result[1].replace(/,/g, '')),
                    type: 'EXPENSE',
                    category
                }
            }
        } else if (text.includes('You have added ')) {
            const result = text.match('You have added\\s*([-.,0-9]+)\\s*Baht');
            if (result) {
                return {
                    accountId: this.getAccountId(text),
                    amount: +(result[1].replace(/,/g, '')),
                    type: 'INCOME',
                    category: 'Uncategorized'
                }
            }
        }
        return null;
    }
}
