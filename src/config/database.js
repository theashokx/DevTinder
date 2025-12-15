const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://devTinder:6GToWXomWy71ll0c@node.nhrgfmi.mongodb.net/testdb"
  );
};

module.exports = connectDB;
