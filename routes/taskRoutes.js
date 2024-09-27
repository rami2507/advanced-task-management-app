const express = require("express");
const multer = require("multer");
const commentRoutes = require("./commentRoutes.js");
const {
  createTask,
  getTasks,
  getOneTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController.js");
const {
  uploadTaskFile,
  resizeTaskFile,
} = require("./../controllers/fileUploadController.js");
const { protect } = require("./../controllers/authController.js");
const {
  validatorMiddleware,
} = require("./../middlewares/validatorMiddleware.js");
const {
  createTaskValidators,
  oneTaskValidator,
} = require("./../utils/validators/taskValidators.js");
const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(
    uploadTaskFile,
    resizeTaskFile,
    createTaskValidators,
    validatorMiddleware,
    createTask
  )
  .get(getTasks);

router
  .route("/:id")
  .get(oneTaskValidator, validatorMiddleware, getOneTask)
  .patch(oneTaskValidator, validatorMiddleware, updateTask)
  .delete(oneTaskValidator, validatorMiddleware, deleteTask);

router.use("/:taskId/comments", commentRoutes);

module.exports = router;
