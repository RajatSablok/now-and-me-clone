const thoughtRepository = require("./thoughtRepository");
const errorStrings = require("../../errors");

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

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
};
