const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

//models
const User = require("../models/User");
const HTTPError = require("../models/Error");

exports.updateUser = async (req, res, next) => {
  const id = req.query.id;
  const { email, name } = req.body;
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    return next(
      new HTTPError(
        "User Credentials incorrect, please provide complete data",
        404
      )
    );
  }
  try {
    await User.findByIdAndUpdate({ _id: id }, { name, email });
    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    return next(new HTTPError(error, 422));
  }
};

exports.addNewUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    return next(
      new HTTPError(
        "User Credentials incorrect, please provide complete data",
        404
      )
    );
  }

  let isExistingUser;
  try {
    isExistingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HTTPError(error.message, 422));
  }
  if (isExistingUser) {
    return next(
      new HTTPError("User already existed, please try to login", 401)
    );
  }

  //password encryption
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HTTPError(error, 422));
  }

  //creating user model
  let user = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await user.save(); //adding the user to the database
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return next(new HTTPError("Failed to create user, please try again", 422));
  }
};

exports.loginUser = async (req, res, next) => {
  //request validation
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HTTPError(
        "Insufficient Credentials were provided, please check the information",
        404
      )
    );
  }
  const { email, password } = req.body;

  //checking if the user is signed in
  let isExistedUser;
  try {
    isExistedUser = await User.findOne({ email });
  } catch (error) {
    return next(
      new HTTPError(
        "An internal error occured while login, please try again later",
        422
      )
    );
  }

  if (!isExistedUser) {
    return next(
      new HTTPError(
        "User not found for the given email, please register again",
        401
      )
    );
  }

  //checking user password with the password obtained in response
  let comparePassword = false;
  try {
    comparePassword = await bcrypt.compare(password, isExistedUser.password);
  } catch (error) {
    return next(new HTTPError(error, 422));
  }

  if (!comparePassword) {
    return next(
      new HTTPError("Incorrect password, please enter correct password", 404)
    );
  }

  //generating token for valid user
  let token = JWT.sign(
    {
      email: isExistedUser.email,
      id: isExistedUser._id,
      name: isExistedUser.name,
      isAdmin: isExistedUser.isAdmin,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1hr" }
  );
  res.status(200).json({
    message: "User logged in successfully",
    token,
    name: isExistedUser.name,
  });
};

exports.getAllUsers = async (req, res, next) => {
  let userData;
  try {
    userData = await User.find({ isAdmin: false }, ["_id", "name", "email"]);
  } catch (error) {
    return next(
      new HTTPError(
        "An error occured while fetching users details, please try again later",
        422
      )
    );
  }
  if (!userData) {
    return next(new HTTPError("No users present", 401));
  }
  res.status(201).json({ user: userData });
};

//deleting a user
exports.deleteUser = async (req, res, next) => {
  const id = req.query.id;

  let existedUser;
  try {
    existedUser = await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: `${existedUser.name} is removed from the database` });
  } catch (error) {
    return next(new HTTPError(error, 422));
  }
};
