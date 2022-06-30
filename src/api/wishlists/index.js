const WishlistsHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: 'wishlist',
  version: '1.0.0',
  register: async (server, { wishlistsService, validator }) => {
    const wishlistsHandler = new WishlistsHandler(wishlistsService, validator);

    server.route(routes(wishlistsHandler));
  },
};
