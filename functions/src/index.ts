import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createTransaction, refreshCacheData } from './toshl';
import citiExtractor from './extractor/citi.extractor';
import kPlusExtractor from './extractor/k-plus.extractor';
import trueMoneyExtractor from './extractor/true-money.extractor';

admin.initializeApp();

const db = admin.firestore();
db.settings({timestampsInSnapshots: true});
const collectionRef = db.collection('raws');

const createReqtestFunction = (type:string, accountId: string, extractor: Function) => {
    return  functions.https.onRequest((request, response) => {
        collectionRef.add({
            text: request.body,
            type,
        }).then((snapshot) => {
            response.send('saved');
    
            const transaction = extractor(request.body);
            console.log('Transaction', transaction);
            if(transaction){
                createTransaction(accountId, transaction, db).then((entry) => {
                    console.log('Entry', entry);
                    collectionRef.doc(snapshot.id).set({
                        text: request.body,
                        type,
                        entry,
                    }).then(updated => {
                        console.log('COMPLETED');
                    });
                });
            }
        });
    });
};

export const refreshCache = functions.https.onRequest((request, response) => {
    refreshCacheData(db).then(() => {
        response.send('COMPLETED');
    })
});

export const citibank = createReqtestFunction('Citibank', functions.config().accounts.citibank, citiExtractor);
export const kplus = createReqtestFunction('K Plus', functions.config().accounts.kplus, kPlusExtractor);
export const trueMoney = createReqtestFunction('TrueMoney', functions.config().accounts.truemoney, trueMoneyExtractor);
