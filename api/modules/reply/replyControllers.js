const replyRepository = require("./replyRepository");
const errorStrings = require("../../../utils/errors");

exports.addReply = async (text, isAnonymous, userId, thoughtId) => {
  try {
    // Save the thought to the database
    const replyAdded = await replyRepository.addReply(
      text,
      isAnonymous,
      userId,
      thoughtId
    );

    if (!replyAdded.success) {
      throw Error(replyAdded.err);
    }

    return { ...replyAdded };
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
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
    if (replies.error) {
      throw Error(replies.error);
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
      success: false,
      error: err.toString(),
    };
  }
};

exports.deleteReply = async (replyId, thoughtId, requestUserId) => {
  try {
    // Find the reply using ID to verify that it was posted by the user
    const reply = await replyRepository.findReplyById(replyId);

    // Handle error
    if (reply.error) {
      throw Error(thoughtAdded.error);
    }

    // Check if given thoughtId matches
    // the thoughtId of the reply object
    if (reply.thoughtId.toString() != thoughtId) {
      throw Error(errorStrings.SOMETHING_WENT_WRONG);
    }

    // Check if the user making the request is the
    // same as the user who posted the reply
    if (reply.userId != requestUserId) {
      throw Error(errorStrings.UNAUTHORIZED);
    }

    const deleted = await replyRepository.deleteReply(replyId);

    // Handle error
    if (deleted.error) {
      throw Error(thoughtAdded.error);
    }

    return true;
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};
