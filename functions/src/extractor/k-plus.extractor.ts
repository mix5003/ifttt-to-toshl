import Transaction from "../transaction";

export default function(text: string): Transaction{
    if(text.includes('รายการโอน/ถอน')){
        const result = text.match('จำนวนเงิน\\s*([-.,0-9]+)\\s*บาท');
        if(result){
            return {
                amount: +(result[1].replace(/,/g,'')),
                type: 'EXPENSE',
                category: 'Uncategorized'
            }
        }
    }else if(text.includes('รายการเงินเข้า')){
        const result = text.match('จำนวนเงิน\\s*([-.,0-9]+)\\s*บาท');
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