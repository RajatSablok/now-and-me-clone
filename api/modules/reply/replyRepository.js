const mongoose = require("mongoose");

const Reply = require("./replyModel");
const { DEFAULT_PAGE_LIMIT } = require("../../../utils/config");

exports.addReply = async (text, isAnonymous, userId, thoughtId) => {
  try {
    const newReply = new Reply({
      _id: new mongoose.Types.ObjectId(),
      text,
      isAnonymous,
      userId,
      thoughtId,
    });
    const result = await newReply.save();

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

exports.findAllRepliesByThoughtId = async (thoughtId, limit, offset) => {
  try {
    const replies = await Reply.find({ thoughtId })
      .select("-__v")
      .skip(offset)
      .limit(limit || DEFAULT_PAGE_LIMIT)
      .populate("userId", "username isAnonymous");

    return replies;
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};

exports.findReplyById = async (replyId) => {
  try {
    const reply = await Reply.findOne({ _id: replyId });

    return reply;
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};

exports.deleteReply = async (replyId) => {
  try {
    const deleted = await Reply.deleteOne({ _id: replyId });

    return deleted;
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};

exports.deleteRepliesByThoughtId = async (thoughtId) => {
  try {
    const deleted = await Reply.deleteMany({ thoughtId });

    return deleted;
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};
