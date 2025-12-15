const express = require("express");
const bcrypt = require("bcrypt");

const connectDB = require("./config/database");
const User = require("./models/User");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const { signUpValidation } = require("./utils/validation");

app.post("/signup", async (req, res) => {
  try {
    //validation
    signUpValidation(req.body);

    //encrpt the password
    const { password, firstName, lastName, emailId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      password: passwordHash,
      emailId,
    });
    await user.save();
    res.send("Sucessfully signed In");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Creditials");
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      throw new Error("Invalid Creditials");
    }

    //Adding cookie to the respnose
    res.cookie("token", "kjhsfdhgduwyeryegregr");
    res.send("Login Successfull");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  res.send("Reading Cookie");
});

app.get("/feed", async (req, res) => {
  const user = await User.find({});
  try {
    console.log(user);
    res.send(user);
  } catch (err) {
    console.log("Error");
    res.status(400).send("Not Found");
  }
});

app.get("/user", async (req, res) => {
  const user = await User.find({ emailId: req.body.emailId });
  try {
    console.log(user);
    res.send(user);
  } catch (err) {
    console.log("Error");
    res.status(400).send("Not Found");
  }
});

app.get("/delete", async (req, res) => {
  const id = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(id);
    res.send(user + "User deleted successfully");
  } catch (err) {
    res.send("Sorry can't be deleted");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params();
  const data = req.body;

  try {
    const allowedUpdates = [
      "photoUrl",
      "password",
      "age",
      "gender",
      "about",
      "skills",
    ];
    const isUpdateAllowed = Object.key
      .key(data)
      .every((k) => allowedUpdates.includes(k));
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const user = await User.findOneAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("Succesfully updated");
  } catch (err) {
    res.send("Error");
  }
});

connectDB()
  .then(() => {
    console.log("Connection successfully");

    app.listen("3000", () => {
      console.log("Server is succesfully listening on port 3000");
    });
  })
  .catch((err) => {
    console.log("COnnection Failed");
  });
