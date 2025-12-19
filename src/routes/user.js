const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/ConnectionRequest");

const userRouter = express.Router();

const INFO_WANTED = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user._id;

    const requests = await connectionRequestModel
      .find({
        toUserId: loggedUser,
        status: "interested",
      })
      .populate("fromUserId", INFO_WANTED);
    res.json({ message: "Data Succesfully fetched", data: requests });
  } catch (err) {
    res.send(500).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const requests = await connectionRequestModel
      .find({
        $or: [
          {
            toUserId: loggedInUser,
            status: "accepted",
          },
          {
            fromUserId: loggedInUser,
            status: "accepted",
          },
        ],
      })
      .populate("fromUserId", INFO_WANTED)
      .populate("toUserId", INFO_WANTED);

    const data = requests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.send({ message: "Sucessfully fetched the data", data: data });
  } catch (err) {
    res.send("Error : " + err.message);
  }
});

module.exports = userRouter;
