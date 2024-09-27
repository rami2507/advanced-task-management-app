const asyncHandler = require("express-async-handler");
const Comment = require("./../models/Comment");
const AppError = require("../utils/AppError");

const addComment = asyncHandler(async (req, res, next) => {
  const { task, user, content } = req.body;

  const newComment = await Comment.create({ task, user, content });

  if (!newComment) {
    next(new AppError("There was an error creating the comment", 401));
  }

  return res.status(201).json({
    status: "success",
    data: { newComment },
  });
});

const getCommentsForTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const comments = await Comment.find({ task: taskId })
    .populate("user")
    .populate("task");
  res.status(200).json({
    status: "success",
    results: comments.length,
    data: { comments },
  });
});

module.exports = { addComment, getCommentsForTask };
