const mongoose = require("mongoose");

const User = require("./userModel");
const errorStrings = require("../../errors");

exports.findUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    if (user)
      return {
        success: true,
        data: user,
      };

    throw Error(errorStrings.USER_NOT_FOUND);
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};

exports.addUser = async (username, password) => {
  try {
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      username,
      password,
    });

    await newUser.save();

    return newUser;
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};
