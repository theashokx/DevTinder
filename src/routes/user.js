const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/ConnectionRequest");
const User = require("../models/User");

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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connections = await connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
      })
      .select("fromUserId toUserId");

    const hiddenUsersFromFeed = new Set();

    connections.forEach((req) => {
      hiddenUsersFromFeed.add(req.fromUserId.toString());
      hiddenUsersFromFeed.add(req.toUserId.toString());
    });

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
        { _id: { $ne: loggedInUser } },
      ],
    })
      .select(INFO_WANTED)
      .skip(skip)
      .limit(limit);

    res.send({ message: "Feed fetched Successfully", data: feedUsers });
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
});

module.exports = userRouter;
