const routes = (handler) => [
  {
    method: 'POST',
    path: '/register',
    handler: handler.postRegisterHandler,
  },
  {
    method: 'POST',
    path: '/login',
    handler: handler.postLoginHandler,
  },
  {
    method: 'PATCH',
    path: '/profile',
    handler: handler.patchProfileHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'PATCH',
    path: '/token',
    handler: handler.patchTokenHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'PATCH',
    path: '/phone',
    handler: handler.patchPhoneHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'PATCH',
    path: '/password/{username}',
    handler: handler.patchPasswordHandler,
  },
  {
    method: 'GET',
    path: '/user',
    handler: handler.getUserHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/clear',
    handler: handler.deleteAllData,
  },
];

module.exports = routes;
