const routes = (handler) => [
  {
    method: 'POST',
    path: '/wishlist',
    handler: handler.postWishlistHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/wishlist',
    handler: handler.getWishlistHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/wishlist',
    handler: handler.deleteWishlistHandle,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
];

module.exports = routes;
