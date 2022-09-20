const userRepository = require("./userRepository");

const { getJWT, getHashedPassword, compareHash } = require("../../utils");

exports.signup = async (userInfo) => {
  try {
    // Check if user exists
    const userExists = await userRepository.findUserByUsername(
      userInfo.username
    );

    // Return error if user already exists
    if (userExists.status) {
      throw Error("Username taken.");
    }

    // Hash password
    const hashedPassword = await getHashedPassword(userInfo.password);

    // Save user to the database
    const userAdded = await userRepository.addUser(
      userInfo.username,
      hashedPassword
    );

    // Generate token
    const token = await getJWT({
      userId: userAdded.data._id,
      username: userAdded.data.username,
      name: userAdded.data.name,
    });

    return {
      _id: userAdded.data._id,
      username: userAdded.data.username,
      token,
    };
  } catch (err) {
    return { status: false, err: err.toString() };
  }
};

exports.login = async (userInfo) => {
  try {
    // Check if user exists
    const userExists = await userRepository.findUserByUsername(
      userInfo.username
    );

    // Return error if user doesn't exist
    if (!userExists.status) {
      throw Error("Auth failed");
    }

    // Check if passwords match
    const isPasswordCorrect = await compareHash(
      userInfo.password,
      userExists.data.password
    );

    if (!isPasswordCorrect) {
      throw Error("Auth failed");
    }

    // Generate token
    const token = await getJWT({
      userId: userExists.data._id,
      username: userExists.data.username,
      name: userExists.data.name,
    });

    return {
      _id: userExists.data._id,
      username: userExists.data.username,
      token,
    };
  } catch (err) {
    return { status: false, err: err.toString() };
  }
};
