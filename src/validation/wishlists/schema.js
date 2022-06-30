const Joi = require('joi');

const WishlistPayloadSchema = Joi.object({
  itemId: Joi.string().required(),
});

module.exports = { WishlistPayloadSchema };
