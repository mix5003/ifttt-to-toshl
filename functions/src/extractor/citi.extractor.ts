import Transaction from "../transaction";
import {TransactionExtractor} from "./extractor";

export class CitiExtractor implements TransactionExtractor {
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
        if (text.includes('ขอบคุณที่ใช้จ่าย')) {
            const result = text.match('ขอบคุณที่ใช้จ่าย\\s*([-.,0-9]+)\\s*บาท');
            let category = 'Uncategorized';
            let tags = null;
            if (text.includes('Grab')) {
                category = 'Travel';
                tags = ['Taxi'];
            }
            if (result) {
                return {
                    accountId: accountId,
                    amount: -1 * +(result[1].replace(/,/g, '')),
                    type: 'EXPENSE',
                    category,
                    tags
                }
            }
        } else if (text.includes('Online Transaction amount')) {
            const result = text.match('Online Transaction amount ([A-Z]+)\\s*([-.,0-9]+)');
            if (result) {
                return {
                    accountId: accountId,
                    amount: -1 * +(result[2].replace(/,/g, '')),
                    type: 'EXPENSE',
                    currency: result[1],
                    category: 'Uncategorized',
                }
            }
        } else if (text.includes('has been charged')) {
            const result = text.match('Card ending [0-9]{4} has been charged ([A-Z]+) ([-.,0-9]+)');
            if (result) {
                return {
                    accountId: accountId,
                    amount: -1 * +(result[2].replace(/,/g, '')),
                    type: 'EXPENSE',
                    currency: result[1],
                    category: 'Uncategorized',
                }
            }
        } else if (text.includes('ขอบพระคุณที่ชำระยอด')) {
            const result = text.match('ขอบพระคุณที่ชำระยอด\\s*([-.,0-9]+)\\s*บ.');
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
