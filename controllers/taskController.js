const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const AppError = require("../utils/AppError");

const createTask = asyncHandler(async (req, res, next) => {
  const taskObj = {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    assignedTo: req.body.assignedTo,
  };

  if (req.file) {
    taskObj.file = req.file.filename;
  }

  const task = await Task.create(taskObj);

  if (!task) {
    return next(new AppError("There was an error creating the task", 400));
  }

  res.status(201).json({
    data: { task },
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find();
  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: { tasks },
  });
});

const getOneTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);

  if (!task) {
    return next(
      new AppError(`there is no task found with this ID: ${id}`, 404)
    );
  }

  return res.status(200).json({
    status: "success",
    data: { task },
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

  await updatedTask.save();

  if (!updatedTask) {
    return next(
      new AppError(`there is no task found with this ID: ${id}`, 404)
    );
  }

  return res.status(200).json({
    status: "success",
    data: { updatedTask },
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedTask = await Task.findOneAndDelete(id);

  if (!updatedTask) {
    return next(
      new AppError(`there is no task found with this ID: ${id}`, 404)
    );
  }

  return res.status(200).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  createTask,
  getTasks,
  getOneTask,
  updateTask,
  deleteTask,
};
