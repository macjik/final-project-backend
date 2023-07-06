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

mongoose 
 .connect(process.env.MONGO_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,   })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

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

const user = new User({
  name: "aka",
  age: 45,
});
user.save();
console.log(user);

module.exports = app;
