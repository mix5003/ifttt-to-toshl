This project is for extract transaction from push notification message and SMS form bank.

# Dependency Service
1. [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm&hl=th) for capture notification and SMS.
2. [Google Firebase](https://firebase.google.com/) for extract message and send to Toshl API.
3. [Toshl](https://toshl.com/) for core track all transaction.

# Step to deploy
1. Sign up Toshl. and get your token.
2. Config firebase project id in `.firebaserc` (copy config from `.firebaserc.example`)
3. First deploy your firebase function. (You need to fill your credit card info to allow your function interact with networks)
```
firebase functions:config:set accounts.kplus.0.digit=bank // bank is unused. i use index base for default.
firebase functions:config:set accounts.kplus.0.account=TOSHL_KPLUS_ACCOUNT_ID // for now 0 mean bank account, otherwise mean credit card
firebase functions:config:set accounts.kplus.1.digit=last4digit1
firebase functions:config:set accounts.kplus.1.account=TOSHL_K_CREDIT_CARD_ACCOUNT_ID_1
firebase functions:config:set accounts.make_by_kplus=TOSHL_MAKE_ACCOUNT_ID
firebase functions:config:set accounts.truemoney.0.digit=wallet
firebase functions:config:set accounts.truemoney.0.account=TOSHL_TRUEMONEY_ACCOUNT_ID
firebase functions:config:set accounts.truemoney.1.digit=last4digit1
firebase functions:config:set accounts.truemoney.1.account=TOSHL_TRUEMONEY_CARD_ACCOUNT_ID_1
firebase functions:config:set accounts.mymo=TOSHL_MYMO_ACCOUNT_ID
firebase functions:config:set accounts.ktb.0.digit=last4digit1
firebase functions:config:set accounts.ktb.0.account=TOSHL_KTC_ACCOUNT_ID_1
firebase functions:config:set accounts.ktc.0.digit=last4digit1
firebase functions:config:set accounts.ktc.0.account=TOSHL_KTC_ACCOUNT_ID_1
firebase functions:config:set accounts.ktc.1.digit=last4digit2
firebase functions:config:set accounts.ktc.1.account=TOSHL_KTC_ACCOUNT_ID_2
firebase functions:config:set accounts.ttb.0.digit=last4digit1
firebase functions:config:set accounts.ttb.0.account=TOSHL_TTB_ACCOUNT_ID_1
firebase functions:config:set accounts.uob.0.digit=last4digit1
firebase functions:config:set accounts.uob.0.account=TOSHL_UOB_ACCOUNT_ID_1
firebase functions:config:set accounts.uchoose.0.digit=last4digit1
firebase functions:config:set accounts.uchoose.0.account=TOSHL_UOB_ACCOUNT_ID_1

firebase functions:config:set toshl.token="YOUR_TOSHL_TOKEN"
npm run deploy
```

4. Install [IFTTT](https://play.google.com/store/apps/details?id=com.ifttt.ifttt&hl=en) in your mobile phone. And sign in.

5. Config IFTTT Applet to capture message and send to firebase functions.

# Config Tasker by yourself (can't remember too. hopefully google drive backup works)