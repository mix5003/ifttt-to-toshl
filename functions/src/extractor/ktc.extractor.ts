import Transaction from "../transaction";
import {BaseExtractor} from "./extractor";

export class KTCExtractor extends BaseExtractor {
    extract(text: string): Transaction | null {
        if (text.includes('ยอด')) {
            const result = text.match('ยอด\\s*([-.,0-9]+)\\s*([A-Z]+)');
            if (result) {
                return {
                    accountId: this.accountId,
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
