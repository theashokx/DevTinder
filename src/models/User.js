const mongoose = require("mongoose");
var validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // validate: [
      //   {
      //     validator: async function (email) {
      //       const count = await mongoose.models.User.countDocuments({
      //         emailId: email,
      //       });
      //       return count === 0;
      //     },
      //     message: "Email already exists",
      //   },
      //   {
      //     validator: function (value) {
      //       return validator.isEmail(value);
      //     },
      //     message: "Invalid emailId",
      //   },
      // ],
      validate: {
        validator: function (value) {
          if (validator.isEmail(value)) throw new Error("Invalid Email Id");
        },
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is Invalid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://w1.pngwing.com/pngs/743/500/png-transparent-circle-silhouette-logo-user-user-profile-green-facial-expression-nose-cartoon.png",
    },
    about: {
      type: String,
      default: "Description about the user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
