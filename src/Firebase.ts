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

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const firebaseApp = firebase;

export const FirebaseErrors = {
  'auth/requires-recent-login': 'Cette opération requiert une session de connexion plus récente, veuillez vous reconnecter pour changer votre mot de passe'
}; // list of firebase error codes to alternate error messages

export interface FirebaseError {
  code: keyof typeof FirebaseErrors;
  message: string;
}
