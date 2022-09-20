const mongoose = require("mongoose");

const Thought = require("./thoughtModel");

exports.addThought = async (text, isAnonymous, userId) => {
  try {
    const newThought = new Thought({
      _id: new mongoose.Types.ObjectId(),
      text,
      isAnonymous,
      userId,
    });
    const result = await newThought.save();

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};

exports.getAllThoughts = async (limit, offset) => {
  try {
    const thoughts = await Thought.find()
      .select("-__v")
      .skip(offset)
      .limit(limit)
      .populate("userId", "username isAnonymous");

    return thoughts;
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};

exports.findThoughtById = async (thoughtId) => {
  try {
    const thought = await Thought.findOne({ _id: thoughtId });

    return thought;
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};

exports.deleteThought = async (thoughtId) => {
  try {
    const deleted = await Thought.deleteOne({ _id: thoughtId });

    return { success: deleted };
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};
