import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, phone_number } = req.body;

  if (!username || !email || !password || !phone_number) {
    throw new Error("Please fill all the fields.");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email already exists.");
  }

  /* const userExists = await User.findOne({username})

    if (userExists) {
        res.status(400)
        throw new Error("User already exists.")
    } */

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User({
    username,
    email,
    password: hashedPassword,
    phone_number,
  });

  try {
    await newUser.save();
    generateToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      phone_number: newUser.phone_number,
      isAdmin: newUser.isAdmin,
      isSeller: newUser.isSeller,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data.");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    const isPasswordValid = await bcrypt.compare(password, userExists.password);

    if (isPasswordValid) {
      generateToken(res, userExists.id);

      res.status(200).json({
        _id: userExists._id,
        username: userExists.username,
        email: userExists.email,
        isAdmin: userExists.isAdmin,
        isSeller: userExists.isSeller,
      });
      return;
    }
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(200).json({
    message: "Successfully logged out.",
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      _id: user._id,
      phone_number: user.phone_number,
      username: user.username,
      email: user.email,
    });

    // res.status(200).json(user)
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    (user.username = req.body.username || user.username),
      (user.email = req.body.email || user.email),
      (user.phone_number = req.body.phone_number || user.phone_number);

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      phone_number: updatedUser.phone_number,
      isAdmin: updatedUser.isAdmin,
      isSeller: updatedUser.isSeller,
    });

    // res.status(200).json(user)
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("You cannot delete an admin user.");
    }

    await User.deleteOne({ _id: user._id });
    res.json({
      message: "User removed successfully",
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    (user.username = req.body.username || user.username),
      (user.email = req.body.email || user.email),
      (user.phone_number = req.body.phone_number || user.phone_number),
      (user.isAdmin = Boolean(req.body.isAdmin)),
      (user.isSeller = Boolean(req.body.isSeller));

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      phone_number: updatedUser.phone_number,
      isAdmin: updatedUser.isAdmin,
      isSeller: updatedUser.isSeller,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserById,
  updateUserById,
  getUserById,
};
