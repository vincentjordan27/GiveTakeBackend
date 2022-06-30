const routes = (handler) => [
  {
    method: 'POST',
    path: '/admin/login',
    handler: handler.postLoginAdminHandler,
  },
];

module.exports = routes;
