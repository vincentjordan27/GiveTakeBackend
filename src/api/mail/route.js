const routes = (handler) => [
  {
    method: 'POST',
    path: '/resetphone',
    handler: handler.postResetPhoneHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/resetpass/{username}',
    handler: handler.postResetPasswordHandler,
  },
  {
    method: 'POST',
    path: '/admin/otp',
    handler: handler.postAdminOtpHandler,
  },
];

module.exports = routes;
