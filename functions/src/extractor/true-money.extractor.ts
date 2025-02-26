import Transaction from "../transaction";
import {TransactionExtractor} from "./extractor";

export class TrueMoneyExtractor implements TransactionExtractor {
    constructor(private cardMap: { digit: string, account: string }[]) {
    }

    getAccountId(text: string): string {
        const card = this.cardMap.find(v => text.indexOf(v.digit) !== -1);
        if (card && (text.includes('บัตร') || text.includes('credit') || text.includes('ด้วยบัญชีธนาคาร'))) {
            return card.account;
        }
        return this.cardMap[0].account;
    }

    extract(text: string): Transaction | null {
        if (text.includes('ชำระเงิน')) {
            let category = 'Uncategorized';
            const textLower = text.toLowerCase();
            if (textLower.includes('7-eleven') || textLower.includes('true vending machine')) {
                category = 'Food'
            }
            let result
            if (result = text.match('ชำระเงิน\\s*([-.,0-9]+)\\s*บ.')) {
                return {
                    accountId: this.getAccountId(text),
                    amount: -1 * +(result[1].replace(/,/g, '')),
                    type: 'EXPENSE',
                    category
                }
            }else if(result = text.match('ชำระเงิน\\s*฿\\s*([-.,0-9]+)\\s*')){
                return {
                    accountId: this.getAccountId(text),
                    amount: -1 * +(result[1].replace(/,/g, '')),
                    type: 'EXPENSE',
                    category
                }
            }
        } else if (text.includes('จ่ายเงินสำเร็จ')) {
            let category = 'Uncategorized';
            const textLower = text.toLowerCase();
            if (textLower.includes('7-eleven') || textLower.includes('true vending machine')) {
                category = 'Food'
            }
            let result
            if (result = text.match('จ่ายเงินสำเร็จ\\s*คุณจ่ายเงิน\\s*฿\\s*([-.,0-9]+)')) {
                return {
                    accountId: this.getAccountId(text),
                    amount: -1 * +(result[1].replace(/,/g, '')),
                    type: 'EXPENSE',
                    category
                }
            }
        } else if (text.includes('You have paid')) {
            const result = text.match('TrueMoney Wallet You have paid\\s*([-.,0-9]+)\\s*THB');
            let category = 'Uncategorized';
            if (text.includes('7-ELEVEN') || text.includes('True Vending Machine')) {
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
