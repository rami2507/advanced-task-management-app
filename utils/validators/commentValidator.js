const User = require("../../models/userModel");
const Task = require("../../models/Task");
const { body, param } = require("express-validator");

const createCommentValidators = [
  body("task")
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
      const isExist = await Task.findById(id);
      if (!isExist) {
        throw new Error(`No results found with this ID: ${id}`);
      }
      return true;
    }),
  body("user")
    .trim()
    .notEmpty()
    .withMessage("Please provide the user ID")
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
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Please specify the content field"),
];

const getCommentsForTaskValidators = [
  param("taskId")
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
      const isExist = await Task.findById(id);
      if (!isExist) {
        throw new Error(`No results found with this ID: ${id}`);
      }
      return true;
    }),
];

module.exports = { createCommentValidators, getCommentsForTaskValidators };
