import Transaction from "../transaction";
import {TransactionExtractor} from "./extractor";

export class KTBExtractor implements TransactionExtractor {
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

        if (text.includes('โอนเงินสำเร็จ')) {
            const result = text.match('โอนเงินออก\\s*-([.,0-9]+)\\s*บาท');
            if (result) {
                return {
                    accountId: accountId,
                    amount: -1 * +(result[1].replace(/,/g, '')),
                    type: 'EXPENSE',
                    currency: 'THB',
                    category: 'Uncategorized',
                }
            }
        }else if (text.includes('รับเงินสำเร็จ')) {
            const result = text.match('ได้รับ\\s*\\+([.,0-9]+)\\s*บาท');
            if (result) {
                return {
                    accountId: accountId,
                    amount: 1 * +(result[1].replace(/,/g, '')),
                    type: 'INCOME',
                    currency: 'THB',
                    category: 'Uncategorized',
                }
            }
        }
        return null;
    }
}
