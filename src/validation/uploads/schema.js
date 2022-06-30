const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/*').required(),
}).unknown();

const DeleteImageSchema = Joi.object({
  imageId: Joi.string().required(),
});

const DeleteImageRewardSchema = Joi.object({
  fileLocation: Joi.string().required(),
});

module.exports = { ImageHeadersSchema, DeleteImageSchema, DeleteImageRewardSchema };
