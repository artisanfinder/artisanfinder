import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC7nJBSHlbuGOprw1xYZZPxSxpkLbdHkj4",
  authDomain: "artisanfinder-67323.firebaseapp.com",
  projectId: "artisanfinder-67323",
  storageBucket: "artisanfinder-67323.appspot.com",
  messagingSenderId: "546675735584",
  appId: "1:546675735584:web:6936a85cae05134e031045"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const googleProvider = new firebase.auth.GoogleAuthProvider();