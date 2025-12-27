const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send("Unauthorized: Token missing");
    }

    const decoded = jwt.verify(token, "devTinder");

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).send("Unauthorized: User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

module.exports = { userAuth };
