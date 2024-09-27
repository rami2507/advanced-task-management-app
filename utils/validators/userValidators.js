const User = require("../../models/userModel");
const { body, param } = require("express-validator");

const isExistChecker = async (value, { req, path }) => {
  const isExist = await User.findOne({ [path]: value });
  if (isExist) {
    throw new Error(`This ${path} already exists!!!`);
  }
  return true;
};

const registerValidators = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Please provide a username")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .custom(isExistChecker),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Please provide an email address")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .custom(isExistChecker),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Please provide a password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role").optional().isIn(["user", "admin"]).withMessage("Invalid role"),
];

const oneUserValidators = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Please provide the task ID")
    .isMongoId()
    .withMessage("Provided ID is not a valid MongoDB ObjectId")
    .custom((value) => {
      if (["123", "abc", "default"].includes(value)) {
        throw new Error("ID is not valid");
      }
      return true;
    })
    .custom(async (id) => {
      const isExist = await User.findById(id);
      if (!isExist) {
        throw new Error(`No results found with this ID: ${id}`);
      }
      return true;
    }),
];

module.exports = { registerValidators, oneUserValidators };
