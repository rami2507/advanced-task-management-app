const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please specify the email and password", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("Email or password is incorrect", 400));
  }

  const isCorrect = await bcrypt.compare(password, user.password);

  if (!isCorrect) {
    return next(new AppError("Email or password is incorrect", 400));
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });

  user.password = undefined;

  return res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

const register = asyncHandler(async (req, res, next) => {
  const userObj = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  if (req.body.photo) {
    userObj.photo = req.body.photo;
  }

  const user = await User.create(userObj);

  user.password = undefined;

  return res.status(201).json({
    status: "success",
    data: { user },
  });
});

const protect = asyncHandler(async (req, res, next) => {
  // 1) Getting Token And Check If It's There
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // } else if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }
  if (!token)
    return next(
      new AppError("Your are not logged in! Please login to get access", 401)
    );

  // 2) Validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check If User Still Exist
  const currentUser = await User.findById(decoded._id);
  if (!currentUser) {
    return next(
      new AppError("the user belonging to this token does no longer exist")
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    for (let i = 0; i < roles.length; i++) {
      if (req.user.role.includes(roles[i])) {
        return next();
      }
    }
    next(new AppError("You do not have permission to do that"), 401);
  };
};

module.exports = { login, register, protect, restrictTo };
