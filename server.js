require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const multer = require("multer");
const fs = require("fs");

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

const usersDB = async () => {
  try {
    const users = await User.find({});
    console.log(users);
    return users;
  } catch (err) {
    console.error(err);
  }
};

app.post("/", async (req, res) => {
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
});

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

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 10604800, // Expiration time in seconds (7 days)
        path: "https://final-project-backend-or53.onrender.com/login",
      })
    );

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.currentUser = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/login", authMiddleware, (req, res) => {
  const currentUser = req.currentUser;
  res.json(currentUser);
});

const collectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  topic: String,
  content: String,
  author: String,
  authorID: mongoose.Schema.Types.ObjectId,
  createdAt: String,
  id: { type: String, unique: true },
});

const collections = mongoose.model("Collection", collectionSchema);

app.post("/collection", async (req, res) => {
  try {
    usersDB()
      .then(async (users) => {
        const usersMap = users.filter(
          (user) =>
            user.username === req.body.storedCollection.author.userData.username
        );
        console.log(`The matching user is ${usersMap}`);
        console.log(usersMap[0]._id);

        const COLLECTIONS = new collections({
          title: req.body.storedCollection.title,
          description: req.body.storedCollection.description,
          topic: req.body.storedCollection.topic,
          content: req.body.storedCollection.content,
          author: usersMap[0].username,
          authorID: usersMap[0]._id,
          createdAt: req.body.storedCollection.createdAt,
          id: req.body.storedCollection.id,
        });
        console.log(COLLECTIONS);
        await COLLECTIONS.save();
      })
      .catch((err) => console.error("Someting you expected", err));

    res.status(200).json(req.body);
  } catch (error) {
    console.error("Error processing data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the data" });
  }
});

const collectionsDB = async () => {
  try {
    const COLLECTIONS = await collections.find({});
    console.log(COLLECTIONS);
    return COLLECTIONS;
  } catch (err) {
    console.error(`error in the function`);
    return err;
  }
};
collectionsDB();

app.post("/home-collections", async (req, res) => {
  try {
    const collections = await collectionsDB();
    res.status(200).json(collections);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the collections" });
  }
});

const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("content"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.json({ error: "Content is empty" });
  }

  const fileStream = fs.createReadStream(`uploads/${file.path}`);

  // res.set({
  //   "Content-Type": file.mimetype,
  //   "Content-Length": file.size,
  // });

  fileStream.pipe(res);
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

module.exports = app;
