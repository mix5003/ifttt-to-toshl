import Transaction from "../transaction";

export interface TransactionExtractor {
    extract(text: string): Transaction | null;
}

export abstract class BaseExtractor implements TransactionExtractor {
    constructor(protected accountId: string) {
    }

    abstract extract(text: string): Transaction | null;
}
