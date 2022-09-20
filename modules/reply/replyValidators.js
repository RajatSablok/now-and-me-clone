const Joi = require("joi");

exports.addReplyBody = async (req) => {
  // Create schema for request validatation
  const schema = Joi.object({
    text: Joi.string().required(),
    isAnonymous: Joi.bool().required(),
  });

  // Validate request body with Joi
  const validated = schema.validate(req.body);

  return validated;
};

exports.addReplyParams = async (req) => {
  // Create schema for request validatation
  const schema = Joi.object({
    thoughtId: Joi.string().hex().length(24).required(),
  });

  // Validate request params with Joi
  const validated = schema.validate(req.params);

  return validated;
};

exports.getAllRepliesOnAThoughtQuery = async (req) => {
  // Create schema for request validatation
  const schema = Joi.object({
    limit: Joi.number().min(1).max(20).optional(),
    offset: Joi.number().min(0).optional(),
  });

  // Validate request body with Joi
  const validated = schema.validate(req.query);

  return validated;
};

exports.getAllRepliesOnAThoughtParams = async (req) => {
  // Create schema for request validatation
  const schema = Joi.object({
    thoughtId: Joi.string().hex().length(24).required(),
  });

  // Validate request params with Joi
  const validated = schema.validate(req.params);

  return validated;
};

exports.deleteReply = async (req) => {
  // Create schema for request validatation
  const schema = Joi.object({
    thoughtId: Joi.string().hex().length(24).required(),
    replyId: Joi.string().hex().length(24).required(),
  });

  // Validate request body with Joi
  const validated = schema.validate(req.params);

  return validated;
};
