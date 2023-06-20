const express = require("express");
const cors = require("cors");
const { initializeApp } =require( "firebase/app");
const { getAnalytics } = require("firebase/analytics");

const app = express();
app.use(express.json())
app.use(cors())

app.listen(3001, () => {
  console.log("yehhh");
});

app.get("/", (req, res) => {
  res.send("Wagwan G");
});

console.log('bro')

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANMX_kCpYJu9N7DrzSf9bu7sf9xWjGu0M",
  authDomain: "final-project-backend-3c767.firebaseapp.com",
  projectId: "final-project-backend-3c767",
  storageBucket: "final-project-backend-3c767.appspot.com",
  messagingSenderId: "370891920659",
  appId: "1:370891920659:web:ce0abe045377f0220176e6",
  measurementId: "G-TD9QXVZRPJ"
};

// Initialize Firebase
const initializeApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(initializeApp);
console.log(analytics)