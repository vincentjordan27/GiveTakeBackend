const Joi = require('joi');

const AddRequestPayloadSchema = Joi.object({
  reason: Joi.string().required(),
  status: Joi.number(),
});

module.exports = { AddRequestPayloadSchema };
