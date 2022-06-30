const Joi = require('joi');

const AddAdvicePayloadSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  desc: Joi.string().required(),
});

module.exports = { AddAdvicePayloadSchema };
