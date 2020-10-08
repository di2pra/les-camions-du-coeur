import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    projectId: process.env.REACT_APP_PROJECT_ID
};

console.log(firebaseConfig);

if (process.env.NODE_ENV !== 'production') {

  firebase.initializeApp(firebaseConfig);

} else {
  fetch('/__/firebase/init.json').then(async response => {
    firebase.initializeApp(await response.json());
  });
}




export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const firebaseApp = firebase;