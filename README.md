This project is for extract transaction from push notification message and SMS form bank.

# Dependency Service
1. [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm&hl=th) for capture notification and SMS.
2. [Google Firebase](https://firebase.google.com/) for extract message and send to Toshl API.
3. [Toshl](https://toshl.com/) for core track all transaction.

# Step to deploy
1. Sign up Toshl. and get your token.
2. Config firebase project id in `.firebaserc` (copy config from `.firebaserc.example`)
3. First deploy your firebase function. (You need to fill your credit card info to allow your function interact with networks) via `npm run deploy`

4. Config Remote Config. add Server remove config named `config` with this json config.
```json
{
  "accounts": {
    "kplus": [
      {
        "digit": "bank",
        "account": "123456"
      },
      {
        "digit": "1234",
        "account": "123456"
      }
    ],
    "ktc": [
      {
        "digit": "1234",
        "account": "123456"
      },
    ],
    "ttb": [
      {
        "digit": "1234",
        "account": "123456"
      },
    ],
    "truemoney": [
      {
        "digit": "wallet",
        "account": "123456"
      },
      {
        "digit": "1234",
        "account": "123456"
      },
    ],
    "ktb": [
      {
        "digit": "123-4",
        "account": "123456"
      }
    ],
    "uob": [
      {
        "digit": "1234",
        "account": "123456"
      }
    ],
    "uchoose": [
      {
        "digit": "1234",
        "account": "123456"
      }
    ],
    "make_by_kplus": "123456",
    "mymo": "123456"
  },
  "toshl": {
    "token": "YOUR_TOSHL_TOKEN"
  }
}
```

5. Install [IFTTT](https://play.google.com/store/apps/details?id=com.ifttt.ifttt&hl=en) / [Tasker](https://play.google.com/store/apps/details/Tasker?id=net.dinglisch.android.taskerm&hl=th) in your mobile phone. And sign in.

5. Config IFTTT Applet to capture message and send to firebase functions.

# Config Tasker by yourself (can't remember too. hopefully google drive backup works)