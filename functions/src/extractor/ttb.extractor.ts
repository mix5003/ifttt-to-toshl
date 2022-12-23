import Transaction from "../transaction";
import {TransactionExtractor} from "./extractor";

export class TTBExtractor implements TransactionExtractor {
    constructor(private cardMap: { digit: string, account: string }[]) {
    }

    getAccountId(text: string): string {
        const card = this.cardMap.find(v => text.indexOf(v.digit) !== -1);
        if (card) {
            return card.account;
        }
        return null;
    }

    extract(text: string): Transaction | null {
        const accountId = this.getAccountId(text);
        if (!accountId) {
            return null;
        }
        if (text.includes('ท่านใช้จ่าย') && text.includes('ทีทีบี')) {
            const result = text.match('ท่านใช้จ่าย\\s*([-.,0-9]+)\\s*([A-Z]+)\\s*ที่');
            let category = 'Uncategorized';
            let tags = null;
            if (text.includes('TMN 7-11') || text.includes('TMN FAST FOOD')) {
                category = 'Food'
            }
            if (result) {
                return {
                    accountId: accountId,
                    amount: -1 * +(result[1].replace(/,/g, '')),
                    type: 'EXPENSE',
                    currency: result[2],
                    category,
                    tags
                }
            }
        }
        if (text.includes('เงินคืนบัตร')) {
            const result = text.match('จำนวน\\s*([-.,0-9]+)\\s*บ.');
            let category = 'CashBack';
            let tags = null;
            if (result) {
                return {
                    accountId: accountId,
                    amount: +(result[1].replace(/,/g, '')),
                    type: 'INCOME',
                    currency: 'THB',
                    category,
                    tags
                }
            }
        }
        return null;
    }
}
