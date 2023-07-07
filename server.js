require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = 3120;

app.use(cors());
app.use(express.json());

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

UserSchema.index({ username: 1 }, { unique: true });

const User = mongoose.model("Users", UserSchema);

app.post("/", async (req, res) => {
  // res.send("ass");
  res.send(req.body);
  console.log(req.body);

  const user = new User({
    username: req.body.userData.username,
    email: req.body.userData.email,
    password: req.body.userData.password,
  });

  try {
    await user.save();
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

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

module.exports = app;
