import Transaction from "../transaction";
import {TransactionExtractor} from "./extractor";

export class UChooseExtractor implements TransactionExtractor {
    constructor(private cardMap: { digit: string, account: string }[]) {
    }

    getAccountId(text: string): string {
        const card = this.cardMap.find(v => text.indexOf('X-' + v.digit) !== -1);
        if (card) {
            return card.account;
        }
        return null;
    }

    extract(text: string): Transaction | null {
        if(text.includes('ขอบคุณที่ใช้บัตร')){
            const accountId = this.getAccountId(text);
            if (!accountId) {
                return null;
            }

            if(text.includes('ดอลลาร์สหรัฐ')){
                const result = text.match(/ขอบคุณที่ใช้บัตร\s+X-[0-9]{4}@.*\s+ยอด\s+([-.,0-9]+)\s+ดอลลาร์สหรัฐ/);
                if (result) {
                    return {
                        accountId: accountId,
                        amount: -1 * +(result[1].replace(/,/g, '')),
                        type: 'EXPENSE',
                        currency: 'USD',
                        category: 'Uncategorized',
                    }
                }
            }else if(text.includes('เยน')){
                const result = text.match(/ขอบคุณที่ใช้บัตร\s+X-[0-9]{4}@.*\s+ยอด\s+([-.,0-9]+)\s+เยน/);
                if (result) {
                    return {
                        accountId: accountId,
                        amount: -1 * +(result[1].replace(/,/g, '')),
                        type: 'EXPENSE',
                        currency: 'JPY',
                        category: 'Uncategorized',
                    }
                }
            }else{
                const result = text.match(/ขอบคุณที่ใช้บัตร\s+X-[0-9]{4}@.*\s+ยอด\s+([-.,0-9]+)\s+/);
                if (result) {
                    return {
                        accountId: accountId,
                        amount: -1 * +(result[1].replace(/,/g, '')),
                        type: 'EXPENSE',
                        currency: 'THB',
                        category: 'Uncategorized',
                    }
                }
            }
        }else if(text.includes('คุณได้รับเครดิตเงินคืน')){
            const result = text.match(/คุณได้รับเครดิตเงินคืน\s+([-.,0-9]+)\s+บาท\s+จากรายการ/);
            if (result) {
                const accountId = this.cardMap[0].account;
                return {
                    accountId: accountId,
                    amount: +(result[1].replace(/,/g, '')),
                    type: 'INCOME',
                    currency: 'THB',
                    category: 'CashBack',
                }
            }
        }

        
        return null;
    }
}
