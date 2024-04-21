import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcjys_JGigpIcLmoUUUP_ZMWzjXL3-dIw",
  authDomain: "solo-ensemble-registration.firebaseapp.com",
  projectId: "solo-ensemble-registration",
  storageBucket: "solo-ensemble-registration.appspot.com",
  messagingSenderId: "636839256193",
  appId: "1:636839256193:web:9294098b45a772d18c2d80"
};
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({   
    prompt : "select_account "
});


export const auth = getAuth();
export const signInWithGooglePopup = async () => await signInWithPopup(auth, provider);
export const signInWithEmail = async (email, password) => {
  await createUserWithEmailAndPassword(auth, email, password);
};
