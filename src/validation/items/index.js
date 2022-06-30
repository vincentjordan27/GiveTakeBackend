const InvariantError = require('../../exceptions/InvariantError');
const { AddItemPayloadSchema, ReceiveItemPayloadSchema } = require('./schema');

const ItemValidator = {
  validatorItemPayload: (payload) => {
    const validationResult = AddItemPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatorReceiveItemPayload: (payload) => {
    const validationResult = ReceiveItemPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ItemValidator;
