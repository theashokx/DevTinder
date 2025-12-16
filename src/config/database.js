const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://devTinder:6GToWXomWy71ll0c@devtinder.sptooju.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
