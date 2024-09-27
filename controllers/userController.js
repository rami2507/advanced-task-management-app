const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  return res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

const getOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return next(
      new AppError(`there is no user found with this ID: ${id}`, 404)
    );
  }

  user.password = undefined;

  return res.status(200).json({
    status: "success",
    data: { user },
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return next(
      new AppError(`there is no user found with this ID: ${id}`, 404)
    );
  }

  return res.status(200).json({
    status: "success",
    data: null,
  });
});

module.exports = { getUsers, getOneUser, deleteUser };
