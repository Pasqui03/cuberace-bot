const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};


// Import the functions you need from the SDKs you need
const fbApp = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const app = fbApp.initializeApp(firebaseConfig);

//firebase
const gF = require('firebase-admin/firestore');
const db = gF.getFirestore(app);

//prova x vedere se funzia
const data = {
  name: 'Los Angeles',
  state: 'CA',
  country: 'USA'
};
