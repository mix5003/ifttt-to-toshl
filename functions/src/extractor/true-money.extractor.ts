import Transaction from "../transaction";

export default function(text: string): Transaction{
    if(text.includes('ชำระเงิน')){
        const result = text.match('ชำระเงิน\\s*([-.,0-9]+)\\s*บ.');
        let category =  'Uncategorized';
        if(text.includes('7-ELEVEN')){
            category = 'Food'
        }
        if(result){
            return {
                amount: -1 * +(result[1].replace(/,/g,'')),
                type: 'EXPENSE',
                category
            }
        }
    }else if(text.includes('You have added ')){
        const result = text.match('You have added\\s*([-.,0-9]+)\\s*Baht');
        if(result){
            return {
                amount: +(result[1].replace(/,/g,'')),
                type: 'INCOME',
                category: 'Uncategorized'
            }
        }
    }
    return null;
}