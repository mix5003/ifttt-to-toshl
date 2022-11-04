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
                if (text.includes('@LINEPAY*BTS01')) {
                    return {
                        accountId: accountId,
                        amount: -1 * +(result[1].replace(/,/g, '')),
                        type: 'EXPENSE',
                        currency: result[2],
                        category: 'Travel',
                        tags: ['BTS'],
                    }
                }else if(text.includes('MRT')){
                    return {
                        accountId: accountId,
                        amount: -1 * +(result[1].replace(/,/g, '')),
                        type: 'EXPENSE',
                        currency: result[2],
                        category: 'Travel',
                        tags: ['MRT'],
                    }
                }else if(text.includes('@BMTA') || text.includes('@T.MANIT TRANSPORTATION') || text.includes('@CHAREONBUS')){
                    return {
                        accountId: accountId,
                        amount: -1 * +(result[1].replace(/,/g, '')),
                        type: 'EXPENSE',
                        currency: result[2],
                        category: 'Travel',
                        tags: ['Bus'],
                    }
                }

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
