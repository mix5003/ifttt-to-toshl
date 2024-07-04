import Transaction from "../transaction";
import {TransactionExtractor} from "./extractor";

export class UOBExtractor implements TransactionExtractor {
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
        const accountId = this.getAccountId(text);
        if (!accountId) {
            return null;
        }
        if (text.includes('UOB')) {
            if(text.includes('ท่านมียอดใช้จ่ายผ่านบัตรยูโอบี')){
                const result = text.match(/บัตรยูโอบี\s+X-[0-9]{4}\s+จำนวน\s+([-.,0-9]+)\s+([A-Z]+)\s+ติดต่อ/);
                if (result) {
                    return {
                        accountId: accountId,
                        amount: -1 * +(result[1].replace(/,/g, '')),
                        type: 'EXPENSE',
                        currency: result[2],
                        category: 'Uncategorized',
                    }
                }
            }else if(text.includes('ท่านใช้บัตร')){
                const result = text.match(/UOB\s+:\s+ขอบคุณ\s+ท่านใช้บัตร(?:เสริม)*\s+X-[0-9]{4}\s+=\s+([-.,0-9]+)\s+([A-Z]+)/);
                if (result) {
                    return {
                        accountId: accountId,
                        amount: -1 * +(result[1].replace(/,/g, '')),
                        type: 'EXPENSE',
                        currency: result[2],
                        category: 'Uncategorized',
                    }
                }
            }else if(text.includes('มีการใช้บัตรยูโอบี')){
                const result = text.match(/มีการใช้บัตรยูโอบี\s+X-[0-9]{4}\s+ที่\s+.*\s+([A-Z]+)\s+([-.,0-9]+)\s+หากไม่ได้ทำรายการติดต่อ/);
                if (result) {
                    return {
                        accountId: accountId,
                        amount: -1 * +(result[2].replace(/,/g, '')),
                        type: 'EXPENSE',
                        currency: result[1],
                        category: 'Uncategorized',
                    }
                }
            }
  
        }
        return null;
    }
}
