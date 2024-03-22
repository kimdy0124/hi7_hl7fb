import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
cred = credentials.Certificate("path/to/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

data = {
    'TODOLIST': 'Finish your code',
    'Status': 'Done'
}

doc_ref = db.collection('taskCollection').document()
doc_ref.set(data)

print('Document ID:', doc_ref.id)