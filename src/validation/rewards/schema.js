const Joi = require('joi');

const AddRewardPayloadSchema = Joi.object({
  name: Joi.string().required(),
  photo: Joi.string().required(),
  desc: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
});

const RedeemRewardPayloadSchema = Joi.object({
  desc: Joi.string().required(),
  totalPoint: Joi.number().required(),
});

module.exports = { AddRewardPayloadSchema, RedeemRewardPayloadSchema };
