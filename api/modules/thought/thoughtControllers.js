const thoughtRepository = require("./thoughtRepository");
const replyRepository = require("../reply/replyRepository");
const errorStrings = require("../../../utils/errors");

exports.addThought = async (text, isAnonymous, userId) => {
  try {
    // Save the thought to the database
    const thoughtAdded = await thoughtRepository.addThought(
      text,
      isAnonymous,
      userId
    );

    if (thoughtAdded.success) return { ...thoughtAdded };

    throw Error(thoughtAdded.error);
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};

exports.getAllThoughts = async (limit, offset) => {
  try {
    let thoughts = await thoughtRepository.getAllThoughts(limit, offset);

    // Handle error
    if (thoughts.error) throw Error(thoughts.error);

    // Remove userId field if the thought was posted anonymously
    for (let thought of thoughts) {
      if (thought.isAnonymous) {
        thought.userId = null;
      }
    }

    return { thoughts };
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};

exports.deleteThought = async (thoughtId, requestUserId) => {
  try {
    // Find the thought using ID to verify that it was posted by the user
    const thought = await thoughtRepository.findThoughtById(thoughtId);

    // Handle error
    if (thought.error) throw Error(thoughtAdded.error);

    // Check if the user making the request is the
    // same as the user who posted the thought
    if (thought.userId != requestUserId) {
      throw Error(errorStrings.UNAUTHORIZED);
    }

    const deleted = await thoughtRepository.deleteThought(thoughtId);

    // Handle error
    if (deleted.error) throw Error(thoughtAdded.error);

    // Delete all replies with the given thought ID
    await replyRepository.deleteRepliesByThoughtId(thoughtId);

    /**
     * Note: We could have handled the above two deletes in a transactions, but according to
     * https://www.digitalocean.com/community/tutorials/how-to-use-transactions-in-mongodb
     * Because of the way they’re implemented in MongoDB, transactions can only be performed
     * on MongoDB instances that are running as part of a larger cluster. And I am using MongoDB
     * locally in a docker container.
     * Also, even if the second delete fails, there will never be any data inconsistency
     * when making API calls (if we don't add other APIs).
     */

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};
