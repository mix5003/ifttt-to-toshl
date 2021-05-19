This project is for extract transaction from push notification message and SMS form bank.

# Dependency Service
1. [IFTTT](https://ifttt.com) for capture notification and SMS.
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
firebase functions:config:set accounts.truemoney=TOSHL_TRUEMONEY_ACCOUNT_ID
firebase functions:config:set accounts.citibanks.0.digit=last4digit1 // firebase functions:config:set accounts.citibanks.0.digit=1234
firebase functions:config:set accounts.citibanks.0.account=TOSHL_CITIBANK_ACCOUNT_ID_1
firebase functions:config:set accounts.citibanks.1.digit=last4digit2
firebase functions:config:set accounts.citibanks.1.account=TOSHL_CITIBANK_ACCOUNT_ID_2
firebase functions:config:set accounts.mymo=TOSHL_MYMO_ACCOUNT_ID
firebase functions:config:set accounts.ktc=TOSHL_KTC_ACCOUNT_ID
firebase functions:config:set toshl.token="YOUR_TOSHL_TOKEN"
npm run deploy
```

4. Install [IFTTT](https://play.google.com/store/apps/details?id=com.ifttt.ifttt&hl=en) in your mobile phone. And sign in.

5. Config IFTTT Applet to capture message and send to firebase functions.

# IFTTT Applet
## TrueMoney 

**This:**
- Service: Android SMS
- Trigger: New SMS received matches search
- Keywords: ชำระเงิน

**That**
- Service: Webhook
- Action: Make a web request
- URL: Your True money firebase url
- Method: POST
- Content-type: text/plain
- Body: {{Text}} - {{FromNumber}}

## Citibank 
**This:**
- Service: Android SMS
- Trigger: New SMS received matches search
- Keywords: Your last 4 digits of credit card

**That**
- Service: Webhook
- Action: Make a web request
- URL: Your Citibank firebase url
- Method: POST
- Content-type: text/plain
- Body: {{Text}} - {{FromNumber}}

## KPlus
**This:**
- Service: Android Device
- Trigger: Notification received from a specific app
- App Name: K PLUS

**That**
- Service: Webhook
- Action: Make a web request
- URL: Your KPlus firebase url
- Method: POST
- Content-type: text/plain
- Body: {{NotificationTitle}} {{NotificationMessage}}

## MyMoLotto (Untested)
**This:**
- Service: Android Device
- Trigger: Notification received from a specific app
- App Name: MyMo

**That**
- Service: Webhook
- Action: Make a web request
- URL: Your MyMoLotto firebase url
- Method: POST
- Content-type: text/plain
- Body: {{NotificationTitle}} {{NotificationMessage}}

## KTC Online (Push Notification)
If you want you can change to SMS triggers. But sometime KTC will double send SMS. I Think it KTC retry process when SMS. And I think SMS will notfication if amount more than 100 THB.
**This:**
- Service: Android Device
- Trigger: Notification received from a specific app
- App Name: KTC Mobile
- Keyword (not necessary): Your last 4 digits of credit card

**That**
- Service: Webhook
- Action: Make a web request
- URL: Your KTC firebase url
- Method: POST
- Content-type: text/plain
- Body: {{NotificationTitle}} {{NotificationMessage}}

