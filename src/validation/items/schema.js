const Joi = require('joi');

const AddItemPayloadSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  desc: Joi.string().required(),
  category: Joi.string().required(),
  address: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  maxRadius: Joi.string().required(),
  status: Joi.number(),
  thumbnail: Joi.string(),
});

const ReceiveItemPayloadSchema = Joi.object({
  ulasan: Joi.string().required(),
});

module.exports = { AddItemPayloadSchema, ReceiveItemPayloadSchema };
