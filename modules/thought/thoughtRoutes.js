const express = require("express");
const router = express.Router();

const thoughtControllers = require("./thoughtControllers");
const thoughtValidators = require("./thoughtValidators");
const checkAuth = require("../../middlewares/checkAuth");

router.post("/", checkAuth, async (req, res, next) => {
  try {
    // Validate request body
    const validated = await thoughtValidators.addThought(req);
    if (validated.error) {
      const error = new Error("Invalid request format");
      error.status = 400;
      return next(error);
    }

    // Follow business logic for posting thought
    const thoughtInfo = req.body;
    const userId = req.user.userId;
    const thoughtData = await thoughtControllers.addThought(
      thoughtInfo.text,
      thoughtInfo.isAnonymous,
      userId
    );

    if (thoughtData.err) throw Error("Something went wrong");

    return res.status(201).json(thoughtData.data);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    // Validate request body
    const validated = await thoughtValidators.getAllThoughts(req);
    if (validated.error) {
      const error = new Error("Invalid request format");
      error.status = 400;
      return next(error);
    }

    // Follow business logic for posting thought
    const { limit, offset } = req.query;
    const thoughts = await thoughtControllers.getAllThoughts(limit, offset);

    if (thoughts.err) throw Error("Something went wrong");

    return res.status(200).json(thoughts);
  } catch (err) {
    next(err);
  }
});

router.delete("/:thoughtId", checkAuth, async (req, res, next) => {
  try {
    // Validate request params
    const validated = await thoughtValidators.deleteThought(req);
    if (validated.error) {
      const error = new Error("Invalid request format");
      error.status = 400;
      return next(error);
    }

    // Follow business logic for posting thought
    const { thoughtId } = req.params;
    const deleted = await thoughtControllers.deleteThought(
      thoughtId,
      req.user.userId
    );

    if (deleted.err) throw Error("Something went wrong");

    return res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
});

// Initialize reply routes
router.use("/:thoughtId/replies", require("../reply/replyRoutes"));

module.exports = router;
