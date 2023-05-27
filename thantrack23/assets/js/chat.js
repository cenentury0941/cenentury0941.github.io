import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";

const firebaseConfig = {

    apiKey: "AIzaSyBE1WUN-Jbl1HRcNDjdlpMtODnpwJgy1Dk",
  
    authDomain: "thantrack23.firebaseapp.com",
  
    databaseURL: "https://thantrack23-default-rtdb.firebaseio.com",
  
    projectId: "thantrack23",
  
    storageBucket: "thantrack23.appspot.com",
  
    messagingSenderId: "740276781666",
  
    appId: "1:740276781666:web:e44d9d6d38813964e5473b"
  
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getDatabase, ref, onValue} from "firebase/database";

const db = getDatabase();
const starCountRef = ref(db, 'Messages/');
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
  //updateStarCount(postElement, data);
});