const express = require("express");
const {
  getOneUser,
  getUsers,
  deleteUser,
} = require("./../controllers/userController");
const {
  login,
  register,
  protect,
  restrictTo,
} = require("./../controllers/authController");
const {
  registerValidators,
  oneUserValidators,
} = require("./../utils/validators/userValidators");
const { validatorMiddleware } = require("./../middlewares/validatorMiddleware");
const {
  cloudinaryUploadUserPhoto,
} = require("./../controllers/fileUploadController");
const router = express.Router();

router.get("/login", login);
router.post(
  "/register",
  registerValidators,
  validatorMiddleware,
  cloudinaryUploadUserPhoto,
  register
);

router.use(protect, restrictTo(["admin"]));

router.route("/").get(getUsers);
router
  .route("/:id")
  .get(oneUserValidators, validatorMiddleware, getOneUser)
  .delete(oneUserValidators, validatorMiddleware, deleteUser);

module.exports = router;
