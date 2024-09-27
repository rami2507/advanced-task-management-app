const { body, param } = require("express-validator");
const Task = require("../../models/Task");
const User = require("../../models/userModel");
const mongoose = require("mongoose");

const createTaskValidators = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Please fill out the title field")
    .isLength({ max: 100 })
    .withMessage("Title cannot be longer than 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Please fill out the description field")
    .isLength({ max: 500 })
    .withMessage("Description cannot be longer than 500 characters"),
  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Invalid status value"),
  body("dueDate")
    .isISO8601()
    .withMessage("Invalid date format")
    .custom((value) => {
      const currentDate = new Date();
      const dueDate = new Date(value);
      if (dueDate <= currentDate) {
        throw new Error("Due date must be in the future");
      }
      return true;
    }),
  body("priority")
    .notEmpty()
    .withMessage("Please select a priority")
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority value"),
  body("assignedTo")
    .notEmpty()
    .withMessage("Please fill out the assignedTo field")
    .isArray()
    .withMessage("assignedTo field must be an Array")
    .custom(async (assignedToIds) => {
      for (const id of assignedToIds) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid MongoDB ID: ${id}`);
        }

        const isExist = await User.findById(id);
        if (!isExist) {
          throw new Error(`No user found with this ID: ${id}`);
        }
      }
      return true;
    }),
];

const oneTaskValidator = [
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
      const isExist = await Task.findById(id);
      if (!isExist) {
        throw new Error(`No results found with this ID: ${id}`);
      }
      return true;
    }),
];

module.exports = { createTaskValidators, oneTaskValidator };
