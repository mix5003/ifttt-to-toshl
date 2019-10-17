import Transaction from "../transaction";

export default function(text: string): Transaction{
    if(text.includes('คุณถูกรางวัลสลากเป็นจำนวนเงิน')){
        const result = text.match('คุณถูกรางวัลสลากเป็นจำนวนเงิน\\s*([-.,0-9]+)\\s*บาท');
        if(result){
            return {
                amount: +(result[1].replace(/,/g,'')),
                type: 'INCOME',
                category: 'สลากออมสิน',
            }
        }
    }
    return null;
}