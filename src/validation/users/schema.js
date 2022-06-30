const Joi = require('joi');

const RegisterPayloadSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ tlds: false }).required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  phone: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  address: Joi.string().required(),
  photo: Joi.string().required(),
});

const UpdateUserPayloadSchema = Joi.object({
  name: Joi.string().required(),
  oldpassword: Joi.string().required(),
  newpassword: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  address: Joi.string().required(),
  photo: Joi.string().required(),
});

const LoginPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const UpdateTokenPayloadSchema = Joi.object({
  token: Joi.string().required(),
});

module.exports = {
  RegisterPayloadSchema,
  LoginPayloadSchema,
  UpdateUserPayloadSchema,
  UpdateTokenPayloadSchema,
};
