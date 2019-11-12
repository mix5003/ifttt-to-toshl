import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createTransaction, refreshCacheData } from './toshl';
import citiExtractor from './extractor/citi.extractor';
import kPlusExtractor from './extractor/k-plus.extractor';
import trueMoneyExtractor from './extractor/true-money.extractor';
import myMoLottoExtractor from './extractor/mymo-lotto.extractor';
import ktcExtractor from './extractor/ktc.extractor';

admin.initializeApp();

const db = admin.firestore();
db.settings({timestampsInSnapshots: true});
const collectionRef = db.collection('raws');

const createReqtestFunction = (type:string, accountId: string, extractor: Function) => {
    return  functions.https.onRequest((request, response) => {
        collectionRef.add({
            text: request.body.toString(),
            type,
        }).then((snapshot) => {
            console.log(typeof request.body.toString(), request.body.toString())
            response.send('saved');
    
            const transaction = extractor(request.body.toString());
            console.log('Transaction', transaction);
            if(transaction){
                createTransaction(accountId, transaction, db).then((entry) => {
                    console.log('Entry', entry);
                    collectionRef.doc(snapshot.id).set({
                        text: request.body.toString(),
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

const accountConfigs = functions.config().accounts || {};
const citibankFn = createReqtestFunction('Citibank', accountConfigs.citibank, citiExtractor);
const kplusFn = createReqtestFunction('K Plus', accountConfigs.kplus, kPlusExtractor);
const trueMoneyFn = createReqtestFunction('TrueMoney', accountConfigs.truemoney, trueMoneyExtractor);
const myMoLottoFn = createReqtestFunction('MyMo', accountConfigs.mymo, myMoLottoExtractor);
const ktcFn = createReqtestFunction('KTC', accountConfigs.ktc, ktcExtractor);

export const api = functions.https.onRequest((request, response) => {
    switch(request.path){
        case '/citibank':
            return citibankFn(request, response);
        case '/kplus':
            return kplusFn(request, response);
        case '/trueMoney':
            return trueMoneyFn(request, response);
        case '/mymo-lotto':
            return myMoLottoFn(request, response);
        case '/ktc':
            return ktcFn(request, response);
        default: break;
    }
    response.send(JSON.stringify({
        params: request.params,
        path: request.path
    }));
});