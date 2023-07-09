require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

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
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

const User = mongoose.model("Users", UserSchema);

// UserSchema.index({ username: 1 }, { unique: true });
app.post(
  "/",
  [
    body("userData.username").notEmpty().withMessage("Username is required"),
    body("userData.email").isEmail().withMessage("Invalid email address"),
    body("userData.password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    // res.send("ass");
    // res.send(req.body);
    console.log(req.body);

    const user = new User({
      username: req.body.userData.username,
      email: req.body.userData.email,
      password: await bcrypt.hash(req.body.userData.password, 10),
    });

    try {
      await user.save();
      res.send(user);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).send("Duplicate name found");
      } else {
        return res.status(500).send("An error occurred while saving the user");
      }
    }
    console.log(user);
  }
);

app.post("/login", async (req, res) => {
  const { username, password } = req.body.userData;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const payload = {
      userId: user._id,
      username: user.username,
    };

    const secretKey = "your_secret_key";
    const expiresIn = "7d";

    const token = jwt.sign(payload, secretKey, { expiresIn });

    // Set the token as a cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        sameSite: "strict",
        maxAge: 10604800, // Expiration time in seconds (7 days)
        path: "http://localhost:3000/login", // Adjust the path if needed
      })
    );

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

module.exports = app;
