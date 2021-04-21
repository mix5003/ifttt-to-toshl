export default interface Transaction {
    accountId: string;
    amount: number;
    category: string;
    type: 'INCOME' | 'EXPENSE';

    currency?: string;

    detail?: string;
    tags?: string[];
}
