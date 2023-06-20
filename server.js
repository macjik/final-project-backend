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
