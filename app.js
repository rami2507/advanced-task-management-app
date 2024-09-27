const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const commentRoutes = require("./routes/commentRoutes");
const globalErrorHandler = require("./middlewares/globalErrorHandling");
const AppError = require("./utils/AppError");
const fileUpload = require("express-fileupload");
const app = express();

dotenv.config({ path: "./.env" });

app.use(fileUpload());

// PARSE DATA
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVE STATIC FILES
app.use("/uploads", express.static("uploads"));

// Mount routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/comments", commentRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`This route is not defined: ${req.path}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
