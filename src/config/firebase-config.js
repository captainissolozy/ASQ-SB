import {getStorage} from "firebase/storage";
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyB-JrM7RzgUfwuwL638anpELH1vdpZF8g8",
    authDomain: "a-square-c59d8.firebaseapp.com",
    projectId: "a-square-c59d8",
    storageBucket: "a-square-c59d8.appspot.com",
    messagingSenderId: "1022071446710",
    appId: "1:1022071446710:web:56296c5d0ae550edd29a17",
    measurementId: "G-SKDB4M29P3"
  };

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export default getFirestore()

