const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://devTinder:6GToWXomWy71ll0c@cluster0.pfqleyb.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
