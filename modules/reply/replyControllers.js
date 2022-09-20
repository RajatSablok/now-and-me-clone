const replyRepository = require("./replyRepository");

exports.addReply = async (text, isAnonymous, userId, thoughtId) => {
  try {
    // Save the thought to the database
    const replyAdded = await replyRepository.addReply(
      text,
      isAnonymous,
      userId,
      thoughtId
    );

    if (!replyAdded.status) {
      throw Error(replyAdded.err.toString());
    }

    return { ...replyAdded };
  } catch (err) {
    return {
      status: false,
      err: err.toString(),
    };
  }
};

exports.getAllRepliesOnAThought = async (thoughtId, limit, offset) => {
  try {
    let replies = await replyRepository.findAllRepliesByThoughtId(
      thoughtId,
      limit,
      offset
    );

    // Handle error
    if (replies.err) {
      throw Error(replies.err.toString());
    }

    // Remove userId field if the reply was posted anonymously
    for (let reply of replies) {
      if (reply.isAnonymous) {
        reply.userId = null;
      }
    }

    return { replies };
  } catch (err) {
    return {
      status: false,
      err: err.toString(),
    };
  }
};

exports.deleteReply = async (replyId, requestUserId) => {
  try {
    // Find the replied using ID to verify that it was posted by the user
    const replied = await replyRepository.findReplyById(replyId);

    // Handle error
    if (replied.err) {
      throw Error(thoughtAdded.err.toString());
    }

    // Check if the user making the request is the
    // same as the user who posted the replied
    if (replied.userId != requestUserId) {
      throw Error("You are not authorized to perform this action.");
    }

    const deleted = await replyRepository.deleteReply(replyId);

    // Handle error
    if (deleted.err) {
      throw Error(thoughtAdded.err.toString());
    }

    return true;
  } catch (err) {
    return {
      status: false,
      err: err.toString(),
    };
  }
};
