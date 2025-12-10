const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
   "mongodb+srv://theashokx1:IEpzSxUNiLEiBw9T@cluster0.d50upzk.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
