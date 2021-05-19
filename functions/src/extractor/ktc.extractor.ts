import Transaction from "../transaction";
import {TransactionExtractor} from "./extractor";

export class KTCExtractor implements TransactionExtractor {
    constructor(private cardMap: { digit: string, account: string }[]) {
    }

    getAccountId(text: string): string {
        const card = this.cardMap.find(v => text.indexOf(v.digit) !== -1);
        if (card) {
            return card.account;
        }
        return this.cardMap[0].account;
    }

    extract(text: string): Transaction | null {
        const accountId = this.getAccountId(text);

        if (!accountId) {
            return null;
        }

        if (text.includes('ยอด')) {
            const result = text.match('ยอด\\s*([-.,0-9]+)\\s*([A-Z]+)');
            if (result) {
                return {
                    accountId: accountId,
                    amount: -1 * +(result[1].replace(/,/g, '')),
                    type: 'EXPENSE',
                    currency: result[2],
                    category: 'Uncategorized',
                }
            }
        }
        return null;
    }
}
