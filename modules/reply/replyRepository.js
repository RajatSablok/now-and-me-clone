const mongoose = require("mongoose");

const Reply = require("./replyModel");

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
      status: true,
      err: null,
      data: result,
    };
  } catch (err) {
    return {
      status: false,
      err: err.toString(),
    };
  }
};

exports.findAllRepliesByThoughtId = async (thoughtId, limit, offset) => {
  try {
    const replies = await Reply.find({ thoughtId })
      .select("-__v")
      .skip(offset)
      .limit(limit)
      .populate("userId", "username isAnonymous");

    return replies;
  } catch (err) {
    return {
      status: false,
      err: err.toString(),
    };
  }
};

exports.findReplyById = async (replyId) => {
  try {
    const reply = await Reply.findOne({ _id: replyId });

    return reply;
  } catch (err) {
    return {
      status: false,
      err: err.toString(),
    };
  }
};

exports.deleteReply = async (replyId) => {
  try {
    const deleted = await Reply.deleteOne({ _id: replyId });

    return deleted;
  } catch (err) {
    return {
      status: false,
      err: err.toString(),
    };
  }
};
