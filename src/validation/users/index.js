const {
  RegisterPayloadSchema, LoginPayloadSchema, UpdateUserPayloadSchema, UpdateTokenPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const UserValidator = {
  validatorRegisterPayload: (payload) => {
    const validationResult = RegisterPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatorLoginPayload: (payload) => {
    const validationResult = LoginPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatorUpdatePayload: (payload) => {
    const validationResult = UpdateUserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatorUpdateToken: (payload) => {
    const validationResult = UpdateTokenPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UserValidator;
