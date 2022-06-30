const routes = (handler) => [
  {
    method: 'POST',
    path: '/request/{id}',
    handler: handler.postRequestHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/request/{id}',
    handler: handler.deleteRequestHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
];

module.exports = routes;
