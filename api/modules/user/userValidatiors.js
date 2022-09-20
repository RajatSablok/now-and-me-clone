const Joi = require("joi");

exports.auth = async (req) => {
  // Create schema for request validatation
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  // Validate request body with Joi
  const validated = schema.validate(req.body);

  return validated;
};
