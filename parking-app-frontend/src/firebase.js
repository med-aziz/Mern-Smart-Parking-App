import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth' // for authentication
import { getDatabase } from 'firebase/database'
import 'firebase/storage' // for storage
import 'firebase/database' // for realtime database
import { getFirestore } from 'firebase/firestore'
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArCpAjX8xuUII4Ts1KybULC-80dHi7rdI",
  authDomain: "parking-app-mern-33ecf.firebaseapp.com",
  databaseURL: "https://parking-app-mern-33ecf-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "parking-app-mern-33ecf",
  storageBucket: "parking-app-mern-33ecf.appspot.com",
  messagingSenderId: "959907496544",
  appId: "1:959907496544:web:d7582997f7b34991b63905"
};
const firebaseApp = initializeApp(firebaseConfig)
const db = getDatabase()
const auth = getAuth()
const provider = new GoogleAuthProvider()
export { auth, provider }
export default db
