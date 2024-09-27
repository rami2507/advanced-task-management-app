const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A task must have a title"],
  },
  description: {
    type: String,
    required: [true, "A task must have a description"],
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  dueDate: {
    type: Date,
    required: true,
    default: Date,
  },
  priority: {
    type: String,
    required: true,
    enum: ["low", "medium", "high"],
  },
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  file: {
    type: String,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
