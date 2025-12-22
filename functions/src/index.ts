import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {createTransaction, refreshCacheData} from './toshl';
import {TransactionExtractor} from './extractor/extractor';
import {KPlusExtractor} from './extractor/k-plus.extractor';
import {TrueMoneyExtractor} from './extractor/true-money.extractor';
import {MyMoExtractor} from './extractor/mymo-lotto.extractor';
import {KTBExtractor} from './extractor/ktb.extractor';
import {KTCExtractor} from './extractor/ktc.extractor';
import {TTBExtractor} from "./extractor/ttb.extractor";
import {UOBExtractor} from "./extractor/uob.extractor";
import {MakeByKPlusExtractor} from './extractor/make-by-kplus.extractor';
import { UChooseExtractor } from './extractor/uchoose.extractor';

admin.initializeApp();

const db = admin.firestore();
db.settings({timestampsInSnapshots: true});
const collectionRef = db.collection('raws');

const TTL_NORMAL = 1 * 365 * 24 * 60 * 60 * 1000; // 1 Year
const TTL_CREATED_ENTRY = 3 * 365 * 24 * 60 * 60 * 1000; // 3 Year

const createRequestFunction = (type: string, extractor: TransactionExtractor) => {
    return functions.https.onRequest(async (request, response) => {
        const refId = (new Date).toISOString();
        const expireAt = (new Date((new Date).getTime() + TTL_NORMAL));

        return await collectionRef.doc(refId).set({
            date: refId,
            expire_at: expireAt,
            text: request.body.toString(),
            type,
        }).then(_ => {
            console.log(typeof request.body.toString(), request.body.toString())

            const transaction = extractor.extract(request.body.toString());
            console.log('Transaction', transaction);
            if(transaction){
                createTransaction(transaction.accountId, transaction, db)
                    .then((entry) => {
                        const expireAt = (new Date((new Date).getTime() + TTL_CREATED_ENTRY));

                        console.log('Entry', entry);
                        collectionRef.doc(refId).set({
                            date: refId,
                            expire_at: expireAt,
                            text: request.body.toString(),
                            type,
                            entry,
                        }).then(updated => {
                            console.log('COMPLETED');
                            response.send('saved');
                        }).catch(err => {
                            console.log("Not Completed");
                            console.error(err);
                            response.send('toshl success, error at firebase ');
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        response.send('error at toshl');
                    });
            }else{
                response.send('no response');
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
const kplusFn = createRequestFunction('K Plus', new KPlusExtractor(accountConfigs.kplus));
const trueMoneyFn = createRequestFunction('TrueMoney', new TrueMoneyExtractor(accountConfigs.truemoney));
const myMoLottoFn = createRequestFunction('MyMo', new MyMoExtractor(accountConfigs.mymo));
const ktbFn = createRequestFunction('KTB', new KTBExtractor(accountConfigs.ktb));
const ktcFn = createRequestFunction('KTC', new KTCExtractor(accountConfigs.ktc));
const ttbFn = createRequestFunction('TTB', new TTBExtractor(accountConfigs.ttb));
const makeFn = createRequestFunction('MAKE By KPlus', new MakeByKPlusExtractor(accountConfigs.make_by_kplus));
const uobFn = createRequestFunction('UOB', new UOBExtractor(accountConfigs.uob));
const uchooseFn = createRequestFunction('UChoose', new UChooseExtractor(accountConfigs.uchoose));

export const api = functions.https.onRequest((request, response) => {
    switch (request.path) {
        case '/kplus':
            return kplusFn(request, response);
        case '/make-by-kplus':
            return makeFn(request, response);
        case '/trueMoney':
            return trueMoneyFn(request, response);
        case '/mymo-lotto':
            return myMoLottoFn(request, response);
        case '/ktb':
            return ktbFn(request, response);
        case '/ktc':
            return ktcFn(request, response);
        case '/ttb':
            return ttbFn(request, response);
        case '/uob':
            return uobFn(request, response);
        case '/uchoose':
            return uchooseFn(request, response);
        default: break;
    }
    response.send(JSON.stringify({
        params: request.params,
        path: request.path
    }));
});
