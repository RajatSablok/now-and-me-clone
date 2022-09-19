const thoughtRepository = require("./thoughtRepository");

exports.addThought = async (text, isAnonymous, userId) => {
  try {
    // Save the thought to the database
    const thoughtAdded = await thoughtRepository.addThought(
      text,
      isAnonymous,
      userId
    );

    if (!thoughtAdded.status) {
      throw Error(thoughtAdded.err.toString());
    }

    return { ...thoughtAdded };
  } catch (err) {
    return {
      status: false,
      err: err.toString(),
    };
  }
};

exports.getAllThoughts = async (limit, offset) => {
  try {
    let thoughts = await thoughtRepository.getAllThoughts(limit, offset);

    // Handle error
    if (thoughts.err) {
      throw Error(thoughts.err.toString());
    }

    // Remove userId field if the thought was posted anonymously
    for (let thought of thoughts) {
      if (thought.isAnonymous) {
        thought.userId = null;
      }
    }

    return { thoughts };
  } catch (err) {
    return {
      status: false,
      err: err.toString(),
    };
  }
};

exports.deleteThought = async (thoughtId, requestUserId) => {
  try {
    // Find the thought using ID to verify that it was posted by the user
    const thought = await thoughtRepository.findThoughtById(thoughtId);

    // Handle error
    if (thought.err) {
      throw Error(thoughtAdded.err.toString());
    }

    // Check if the user making the request is the
    // same as the user who posted the thought
    if (thought.userId != requestUserId) {
      throw Error("You are not authorized to perform this action.");
    }

    const deleted = await thoughtRepository.deleteThought(thoughtId);

    // Handle error
    if (thought.err) {
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
