const InvariantError = require('../../exceptions/InvariantError');
const { ImageHeadersSchema, DeleteImageSchema, DeleteImageRewardSchema } = require('./schema');

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteImage: (payload) => {
    const validationResult = DeleteImageSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteReward: (payload) => {
    const validationResult = DeleteImageRewardSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
