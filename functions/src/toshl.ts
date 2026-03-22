import Transaction from "./transaction";
import { Firestore } from "firebase-admin/firestore";

export class ToshlClient {
    constructor(private token: string){
    }

    async refreshCacheData(db: Firestore){
        const categories = await fetch("https://api.toshl.com/categories?per_page=500", {
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        }).then(res => res.json());

        categories.map((cat: {id: number, [key: string]: any}) => {
            db.collection('categories').doc(`${cat.id}`).set(cat);
        });

        const tags = await fetch("https://api.toshl.com/tags?per_page=500", {
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        }).then(res => res.json());

        tags.map((tag:  {id: number, [key: string]: any}): any => {
            db.collection('tags').doc(`${tag.id}`).set(tag);
        });
    }

    async createTransaction(account: string, transaction: Transaction, db: Firestore) {
        let transactionTags: string[] = [];
        if(transaction.tags){
            const tags = await db.collection('tags').get(); 
            transactionTags = transaction.tags
                .map(tag => {
                    return tags.docs.find(t => t.data().name === tag && t.data().type === transaction.type.toLowerCase());
                })
                .filter(t => !! t)
                .map(t => t.id);
        }

        console.log('START GET Categories');
        const categories = await db.collection('categories').get();
        console.log('END GET Categories');

        const category = categories.docs
            .find(c => c.data().name === transaction.category && c.data().type === transaction.type.toLowerCase());
        if(!category){
            throw new Error("No categories")
        }

        const categoryId = category.id;
        const currency = transaction.currency || 'THB';

        const currentDate = (new Date((+new Date) + (7 * 3600 * 1000)));
        const fullMonth = currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : `${currentDate.getMonth() + 1}`;
        const fullDate = currentDate.getDate() + 1 < 10 ? `0${currentDate.getDate()}` : `${currentDate.getDate()}`;

        const entry = {
            amount: transaction.amount,
            currency: {
                code: currency
            },
            date: `${currentDate.getFullYear()}-${fullMonth}-${fullDate}`,
            desc: transaction.detail,
            account: account,
            category: categoryId,
            tags: transactionTags,
        };

        console.log(JSON.stringify(entry));

        const response = await fetch('https://api.toshl.com/entries', {
            method:"POST",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            },
            redirect: 'manual',
            body: JSON.stringify(entry),
        });

        console.log(response.status);

        if(response.status != 201){
            const body = await response.text()
            throw new Error(response.status + " : "+body);
        }

        const entryResponse = await fetch('https://api.toshl.com/'+response.headers.get('location'), {
            method:"GET",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
        }).then(res => res.json());

        return entryResponse;
    }
}
