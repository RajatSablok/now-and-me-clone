const { verifyJWT } = require("../utils");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      const error = new Error("Access Denied! No token entered.");
      error.status = 401;
      return next(error);
    }

    const header = req.headers.authorization.split(" ");
    const tokenFormat = header[0];
    const token = header[1];

    if (tokenFormat != "Bearer") {
      const error = new Error("Access Denied! Invalid access token format.");
      error.status = 401;
      return next(error);
    }

    const verified = verifyJWT(token);

    if (!verified) {
      const error = new Error("Access Denied! Invalid token.");
      error.status = 401;
      return next(error);
    }

    req.user = verified;
    next();
  } catch (err) {
    const error = new Error("Access Denied! Invalid token.");
    error.status = 401;
    return next(error);
  }
};
