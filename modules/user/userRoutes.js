const express = require("express");
const router = express.Router();

const userControllers = require("./userControllers");
const userValidators = require("./userValidatiors");

router.post("/", async (req, res, next) => {
  try {
    // Validate request body
    const validated = await userValidators.auth(req);
    if (validated.error) {
      const error = new Error("Invalid request format");
      error.status = 400;
      return next(error);
    }

    // Follow business logic for authentication
    const userInfo = req.body;
    const userData = await userControllers.auth(userInfo);

    return res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
