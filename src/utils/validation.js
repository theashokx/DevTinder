const validator = require("validator");

const signUpValidation = (req) => {
  const { emailId, firstName, lastName, password } = req;

  if (!firstName || !lastName) {
    throw new Error("Please enter both first and last name");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be strong (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol)"
    );
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "emailId",
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { signUpValidation, validateEditProfileData };
