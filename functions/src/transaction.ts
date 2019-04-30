export default interface Transaction {
    amount: number;
    category: string;
    type: 'INCOME'|'EXPENSE';

    currency?: string;

    detail?: string;
    tags?: string[];
}