const userRepository = require("./userRepository");

const {
  getJWT,
  getHashedPassword,
  compareHash,
} = require("../../../utils/utils");
const errorStrings = require("../../../utils/errors");

exports.signup = async (userInfo) => {
  try {
    // Check if user exists
    const userExists = await userRepository.findUserByUsername(
      userInfo.username
    );

    // Return error if user already exists
    if (userExists.success) {
      throw Error(errorStrings.USERNAME_TAKEN);
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
      userId: userAdded._id,
      username: userAdded.username,
      name: userAdded.name,
    });

    return {
      _id: userAdded._id,
      username: userAdded.username,
      token,
    };
  } catch (err) {
    throw Error(err);
  }
};

exports.login = async (userInfo) => {
  try {
    // Check if user exists
    const userExists = await userRepository.findUserByUsername(
      userInfo.username
    );

    // Return error if user doesn't exist
    if (userExists.error) {
      throw Error(errorStrings.AUTH_FAILED);
    }

    // Check if passwords match
    const isPasswordCorrect = await compareHash(
      userInfo.password,
      userExists.data.password
    );

    if (!isPasswordCorrect) {
      throw Error(errorStrings.AUTH_FAILED);
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
    throw Error(err);
  }
};
