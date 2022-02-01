import Transaction from "../transaction";
import {TransactionExtractor} from "./extractor";

export class KPlusExtractor implements TransactionExtractor {
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

        if (text.includes('รายการโอน/ถอน')) {
            const result = text.match('จำนวนเงิน\\s*-*([-.,0-9]+)\\s*บาท');
            if (result) {
                let value = +(result[1].replace(/,/g, ''));
                if(value > 0){
                    value = -value;
                }
                return {
                    accountId: accountId,
                    amount: value,
                    type: 'EXPENSE',
                    category: 'Uncategorized'
                }
            }
        } else if (text.includes('รายการเงินเข้า')) {
            const result = text.match('จำนวนเงิน\\s*([-.,0-9]+)\\s*บาท');
            if (result) {
                return {
                    accountId: accountId,
                    amount: +(result[1].replace(/,/g, '')),
                    type: 'INCOME',
                    category: 'Uncategorized'
                }
            }
        } else if (text.includes('รายการใช้บัตร')){
            const result = text.match('จำนวนเงิน\\s*([-.,0-9]+)\\s*บาท');
            if (result) {
                return {
                    accountId: accountId,
                    amount: -(result[1].replace(/,/g, '')),
                    type: 'EXPENSE',
                    category: 'Uncategorized'
                }
            }
        }
        return null;
    }
}
