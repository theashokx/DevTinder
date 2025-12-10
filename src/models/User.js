const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
    },
    lastName: {
      type: String,
      trim: true,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email format",
      },
    },

    password: {
      type: String,
      required: true,
      minLength: 6,
      select: false,
    },

    age: {
      type: Number,
      min: 1,
      max: 100,
    },

    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },

    photoUrl: {
      type: String,
      default:
        "https://w1.pngwing.com/pngs/743/500/png-transparent-circle-silhouette-logo-user-user-profile-green-facial-expression-nose-cartoon.png",
      validate: {
        validator: (value) => validator.isURL(value),
        message: "Invalid photo URL",
      },
    },

    about: {
      type: String,
      default: "Description about the user",
      trim: true,
      maxLength: 200,
    },

    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

mongoose.set("runValidators", true);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
