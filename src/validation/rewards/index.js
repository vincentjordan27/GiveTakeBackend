const InvariantError = require('../../exceptions/InvariantError');
const { AddRewardPayloadSchema, RedeemRewardPayloadSchema } = require('./schema');

const RewardValidator = {
  validatorRewardPayload: (payload) => {
    const validationResult = AddRewardPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatorRedeemPayload: (payload) => {
    const validationResult = RedeemRewardPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = RewardValidator;
