import Transaction from "../transaction";

export interface TransactionExtractor {
    extract(text: string): Transaction | null;
}