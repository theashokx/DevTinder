
<<<<<<< HEAD
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(
process.env.MONGO_URI
  );
};

module.exports = connectDB;
=======
>>>>>>> 3d2a5db39ca29cd81ea7784ffbf0232b0136e0fb
