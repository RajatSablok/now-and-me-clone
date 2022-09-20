const express = require("express");
const router = express.Router();

const userControllers = require("./userControllers");
const userValidators = require("./userValidatiors");
const errorStrings = require("../../../utils/errors");

router.post("/signup", async (req, res, next) => {
  try {
    // Validate request body
    const validated = await userValidators.auth(req);
    if (validated.error) {
      const error = new Error(errorStrings.INVALID_REQUEST);
      error.status = 400;
      return next(error);
    }

    // Follow business logic for authentication
    const userInfo = req.body;
    const userData = await userControllers.signup(userInfo);

    return res.status(201).json(userData);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    // Validate request body
    const validated = await userValidators.auth(req);
    if (validated.error) {
      const error = new Error(errorStrings.INVALID_REQUEST);
      error.status = 400;
      return next(error);
    }

    // Follow business logic for authentication
    const userInfo = req.body;
    const userData = await userControllers.login(userInfo);

    return res.status(200).json(userData);
  } catch (err) {
    err.status = 401;
    next(err);
  }
});

module.exports = router;
