const express = require("express");
const router = express.Router({ mergeParams: true });

const replyControllers = require("./replyControllers");
const replyValidators = require("./replyValidators");
const checkAuth = require("../../middlewares/checkAuth");

router.post("/", checkAuth, async (req, res, next) => {
  try {
    // Validate request body and params
    const validatedBody = await replyValidators.addReplyBody(req);
    const validatedParams = await replyValidators.addReplyParams(req);
    if (validatedBody.error || validatedParams.error) {
      const error = new Error("Invalid request format");
      error.status = 400;
      return next(error);
    }

    // Follow business logic for posting thought
    const replyInfo = req.body;
    const { thoughtId } = req.params;
    const { userId } = req.user;
    const replyData = await replyControllers.addReply(
      replyInfo.text,
      replyInfo.isAnonymous,
      userId,
      thoughtId
    );

    if (replyData.err) throw Error("Something went wrong");

    return res.status(201).json(replyData.data);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    // Validate request query and parsm
    const validatedQuery = await replyValidators.getAllRepliesOnAThoughtQuery(
      req
    );
    const validatedParams = await replyValidators.getAllRepliesOnAThoughtParams(
      req
    );
    if (validatedQuery.error || validatedParams.error) {
      const error = new Error("Invalid request format");
      error.status = 400;
      return next(error);
    }

    // Follow business logic for posting thought
    const { limit, offset } = req.query;
    const { thoughtId } = req.params;
    const thoughts = await replyControllers.getAllRepliesOnAThought(
      thoughtId,
      limit,
      offset
    );

    if (thoughts.err) throw Error("Something went wrong");

    return res.status(200).json(thoughts);
  } catch (err) {
    next(err);
  }
});

router.delete("/:replyId", checkAuth, async (req, res, next) => {
  try {
    // Validate request body
    const validated = await replyValidators.deleteReply(req);
    if (validated.error) {
      const error = new Error("Invalid request format");
      error.status = 400;
      return next(error);
    }

    // Follow business logic for posting thought
    const { replyId } = req.params;
    const { userId } = req.user;
    const deleted = await replyControllers.deleteReply(replyId, userId);

    if (deleted.err) throw Error("Something went wrong");

    return res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
