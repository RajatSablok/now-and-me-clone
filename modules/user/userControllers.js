const userRepository = require("./userRepository");

const { getJWT, getHashedPassword, compareHash } = require("../../utils");

exports.auth = async (userInfo) => {
  try {
    // Check if user exists
    const userExists = await userRepository.findUserByUsername(
      userInfo.username
    );

    // Signup if user doesn't exist, else login
    if (!userExists.status) {
      // Hash password
      const hashedPassword = await getHashedPassword(userInfo.password);

      // Save user to the database
      const userAdded = await userRepository.addUser(
        userInfo.username,
        hashedPassword
      );

      userExists.data = userAdded.data;
    } else {
      // Check if passwords match
      const isPasswordCorrect = await compareHash(
        userInfo.password,
        userExists.data.password
      );

      if (!isPasswordCorrect) {
        throw Error("Auth failed");
      }
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
