const express = require("express");
const {
  createCommentValidators,
  getCommentsForTaskValidators,
} = require("./../utils/validators/commentValidator.js");
const {
  addComment,
  getCommentsForTask,
} = require("../controllers/commentController.js");

const {
  validatorMiddleware,
} = require("./../middlewares/validatorMiddleware.js");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(createCommentValidators, validatorMiddleware, addComment)
  .get(getCommentsForTaskValidators, validatorMiddleware, getCommentsForTask);

module.exports = router;
