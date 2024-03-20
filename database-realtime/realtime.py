import pyrebase

config = {
  "apiKey:" "AIzaSyA4Krn4cuEumQHVVS1oRxaaAkHm2h7Suw8",
  "authDomain:" "hi7-hl7.firebaseapp.com",
  "databaseURL:" "https://hi7-hl7-default-rtdb.firebaseio.com",
  "projectId:" "hi7-hl7",
  "storageBucket:" "hi7-hl7.appspot.com",
  "messagingSenderId:" "410837804656",
  "appId:" "1:410837804656:web:38fe4aeaccb29d1eee36b5",
  "measurementId:" "G-WK8LCJP128"
}

firebase = pyrebase.initialize_app(config)
database = firebase.database()

data = {"Age": 21}

database.push(data)