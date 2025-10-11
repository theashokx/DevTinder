const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://+"mail and password"+@cluster0.d50upzk.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
