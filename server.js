require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log("yehhh");
});

app.get("/", (req, res) => {
  res.send("Wagwan G");
});

console.log("bro");

mongoose.connect(
  process.env.MONGO_DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  console.log("connected to db")
);

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("Users", UserSchema);

module.exports = app;
