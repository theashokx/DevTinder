const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      const toUser = await User.findOne({ _id: toUserId });
      if (!toUser) {
        throw new Error("User not Found");
      }

      if (!allowedStatus.includes(status)) {
        return res.send("Incorrect status");
      }

      const existedConnectionRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { toUserId, fromUserId },
        ],
      });

      if (existedConnectionRequest) {
        return res.json({ message: "Already request has been sent" });
      }

      const connection = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connection.save();
      res.json({
        message: req.user.firstName + " " + status + " " + toUser.firstName,
        data: data,
      });
    } catch (err) {
      res.status(404).send("Error : " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedUserId = req.user._id;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const connection = await connectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedUserId,
        status: "interested",
      });

      if (!connection) {
        return res.status(404).json({ message: "Request not found" });
      }

      connection.status = status;
      await connection.save();

      res.json({
        message: `Connection ${status}`,
        data: connection,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = requestRouter;
