const routes = (handler) => [
  {
    method: 'POST',
    path: '/advice',
    handler: handler.postAdviceHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/myadvices',
    handler: handler.getMyAdvicesHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/advices',
    handler: handler.getAdvicesHandler,
  },
  {
    method: 'POST',
    path: '/reply/{id}',
    handler: handler.postReplyHandler,
  },
];

module.exports = routes;
