import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getRemoteConfig } from "firebase-admin/remote-config";
import { HttpsFunction, onRequest } from 'firebase-functions/https';
import {ToshlClient} from './toshl';
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

let cacheHandler : {[key: string]: HttpsFunction}|null = null;

const firebaseApp = initializeApp();

const rc = getRemoteConfig(firebaseApp);

const db = getFirestore(firebaseApp);
db.settings({timestampsInSnapshots: true});
const collectionRef = db.collection('raws');

const TTL_NORMAL = 1 * 365 * 24 * 60 * 60 * 1000; // 1 Year
const TTL_CREATED_ENTRY = 3 * 365 * 24 * 60 * 60 * 1000; // 3 Year

const createRequestFunction = (type: string, toshlClient: ToshlClient, extractor: TransactionExtractor) => {
    return onRequest(async (request, response) => {
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
                toshlClient.createTransaction(transaction.accountId, transaction, db)
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

export const refreshCache = onRequest(async (request, response) => {
    const template = await rc.getServerTemplate();
    const config = template.evaluate();
    const allConfig = JSON.parse(config.getString("config"));
    const client = new ToshlClient(allConfig['toshl']['token'])

    client.refreshCacheData(db).then(() => {
        response.send('COMPLETED');
    })
});

async function getHandler() {
    if(cacheHandler){
        return cacheHandler;
    }

    const template = await rc.getServerTemplate();

    const config = template.evaluate();
    const allConfig = JSON.parse(config.getString("config"));
    const accountConfigs = allConfig['accounts'];
    const client = new ToshlClient(allConfig['toshl']['token'])



    cacheHandler = {
        '/kplus':           createRequestFunction('K Plus', client, new KPlusExtractor(accountConfigs.kplus)),
        '/trueMoney':       createRequestFunction('TrueMoney', client, new TrueMoneyExtractor(accountConfigs.truemoney)),
        '/mymo-lotto':      createRequestFunction('MyMo', client, new MyMoExtractor(accountConfigs.mymo)),
        '/ktb':             createRequestFunction('KTB', client, new KTBExtractor(accountConfigs.ktb)),
        '/ktc':             createRequestFunction('KTC', client, new KTCExtractor(accountConfigs.ktc)),
        '/ttb':             createRequestFunction('TTB', client, new TTBExtractor(accountConfigs.ttb)),
        '/make-by-kplus':   createRequestFunction('MAKE By KPlus', client, new MakeByKPlusExtractor(accountConfigs.make_by_kplus)),
        '/uob':             createRequestFunction('UOB', client, new UOBExtractor(accountConfigs.uob)),
        '/uchoose':         createRequestFunction('UChoose', client, new UChooseExtractor(accountConfigs.uchoose)),
    }

    return cacheHandler;
}

export const api = onRequest(async (request, response) => {
    const handler = await getHandler();
    if(request.path in handler){
        return handler[request.path](request, response);
    }

    response.send(JSON.stringify({
        params: request.params,
        path: request.path
    }));
});
