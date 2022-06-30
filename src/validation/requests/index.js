const { AddRequestPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const RequestValidator = {
  validatorRequestPayload: (payload) => {
    const validationResult = AddRequestPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = RequestValidator;
