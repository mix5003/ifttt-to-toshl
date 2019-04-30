import Transaction from "./transaction";
import * as admin from 'firebase-admin';
import * as request from 'request-promise';
import * as functions from 'firebase-functions';

const accessToken = functions.config().toshl.token;

export const refreshCacheData = async function(db: admin.firestore.Firestore){
    const categories = await request({
        method:"GET",
        url: "https://api.toshl.com/categories?per_page=500",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });

    JSON.parse(categories).map(cat => {
        db.collection('categories').doc(cat.id).set(cat);
    });

    const tags = await request({
        method:"GET",
        url: "https://api.toshl.com/tags?per_page=500",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });

    JSON.parse(tags).map(tag => {
        db.collection('tags').doc(tag.id).set(tag);
    });
}

export const createTransaction = async function(account: string, transaction: Transaction, db: admin.firestore.Firestore) {
    let transactionTags = [];
    if(transaction.tags){
        const tags = await db.collection('tags').get(); 
        transactionTags = transaction.tags
            .map(tag => {
                return tags.docs.find(t => t.data().name === tag && t.data().type === transaction.type.toLowerCase());
            })
            .filter(t => !! t)
            .map(t => t.id);
    }

    const categories = await db.collection('categories').get();
    const categoryId = categories.docs
        .find(c => c.data().name === transaction.category && c.data().type === transaction.type.toLowerCase())
        .id;

    const currency = transaction.currency || 'THB';

    const entry = {
        amount: transaction.amount,
        currency: {
            code: currency
        },
        date: (new Date).toISOString().substring(0, 10),
        desc: transaction.detail,
        account: account,
        category: categoryId,
        tags: transactionTags,
    };

    console.log(entry);

    const response = await request({
        url: 'https://api.toshl.com/entries',
        method:"POST",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(entry),
        
        followRedirect: false,
        followAllRedirects: false,
        resolveWithFullResponse: true,
    });

    if(response.statusCode > 400){
        throw new Error(response.statusCode + " : "+response.body);
    }

    const entryResponse = await request({
        url: 'https://api.toshl.com/'+response.headers.location,
        method:"GET",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    });

    return JSON.parse(entryResponse);
};