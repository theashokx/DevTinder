const express = require("express");
const { signUpValidation } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Creditials");
    }
    const check = await user.validatePassword(password);
    if (!check) {
      throw new Error("Invalid Creditials");
    }
    //jwt
    const token = await user.getJWT();

    //Adding cookie to the respnose
    res.cookie("token", token);
    res.send("Login Successfull");
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Succesfully");
});

module.exports = authRouter;
