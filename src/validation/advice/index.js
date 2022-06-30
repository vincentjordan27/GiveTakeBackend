const InvariantError = require('../../exceptions/InvariantError');
const { AddAdvicePayloadSchema } = require('./schema');

const AdviceValidator = {
  validatorAdvicePayload: (payload) => {
    const validationResult = AddAdvicePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AdviceValidator;
