const express = require("express");

const connectDB = require("./config/database");
const User = require("./models/User");
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  // const userObject = {
  //   firstName: "Raj",
  //   lastName: "Kumar",
  //   emailId: "raj@gamil.com",
  //   password: "rajkumar@123",
  // };

  const user = new User(req.body);

  try {
    await user.save();
    res.send("Sucessfully logged In");
  } catch (err) {
    res.status(400).send("Error saving in the user" + err.message);
  }
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
