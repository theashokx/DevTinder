const express = require("express");

const connectDB = require("./config/database");
const User = require("./models/User");
const app = express();

app.post("/signup", async (req, res) => {
  const userObject = {
    firstName: "Raj",
    lastName: "Kumar",
    emailId: "raj@gamil.com",
    password: "rajkumar@123",
  };

  const user = new User(userObject);

  try {
    await user.save();
    res.send("Sucessfully logged In");
  } catch (err) {
    res.status(400).send("Error saving in the user");
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
