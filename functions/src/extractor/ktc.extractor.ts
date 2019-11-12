import Transaction from "../transaction";

export default function(text: string): Transaction{
    if(text.includes('ยอด')){
        const result = text.match('ยอด\\s*([-.,0-9]+)\\s*([A-Z]+)');
        if(result){
            return {
                amount: -1 * +(result[1].replace(/,/g,'')),
                type: 'EXPENSE',
                currency: result[2],
                category: 'Uncategorized',
            }
        }
    }
    return null;
}