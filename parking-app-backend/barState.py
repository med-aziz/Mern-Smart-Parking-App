import pyrebase

config = {
    "apiKey": "AIzaSyArCpAjX8xuUII4Ts1KybULC-80dHi7rdI",
    "authDomain": "parking-app-mern-33ecf.firebaseapp.com",
    "databaseURL": "https://parking-app-mern-33ecf-default-rtdb.europe-west1.firebasedatabase.app",
    "storageBucket": "parking-app-mern-33ecf.appspot.com"
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()

print('var : ', db.child('var').get().val())
print('var1 : ', db.child('var1').get().val())


def stream_handler(message):
    print('var changed')
    print(message["event"])  # put
    print(message["path"])  # /-K7yGTTEp7O549EzTYtI
    print(message["data"])  # {'title': 'Pyrebase', "body": "etc..."}


def stream_handler1(message):
    print('var1 changed')
    print(message["event"])  # put
    print(message["path"])  # /-K7yGTTEp7O549EzTYtI
    print(message["data"])  # {'title': 'Pyrebase', "body": "etc..."}


my_stream = db.child("var").stream(stream_handler)
my_stream1 = db.child("var1").stream(stream_handler1)
