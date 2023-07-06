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

console.log("bro");

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    default: 0,
  },
});

UserSchema.index({ name: 1 }, { unique: true });

const User = mongoose.model("Users", UserSchema);

const user = new User({
  name: "aka",
  age: 45,
});

app.get("/", async (req, res) => {
  try {
    // res.send("Wagwan G");
    await user.save();
    res.send(user);
    console.log(user);
    console.log(req)
  } catch (error) {
    if (error.code === 11000) {
      console.log("Duplicate name found. Ignoring the error.");
    } else {
      console.log("An error occurred while saving the user:", error);
    }
  }
});

// app.get("http://localhost:3000/register", (req, res) => {
//   console.log(req);
// });

module.exports = app;
