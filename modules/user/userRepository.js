const mongoose = require("mongoose");

const User = require("./userModel");

exports.findUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    if (user)
      return {
        status: true,
        err: null,
        data: user,
      };

    return {
      status: false,
      err: null,
      data: null,
    };
  } catch (err) {
    return {
      status: false,
      err: err.toString(),
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

    return {
      status: true,
      err: null,
      data: newUser,
    };
  } catch (err) {
    return {
      status: false,
      err: err.toString(),
    };
  }
};
