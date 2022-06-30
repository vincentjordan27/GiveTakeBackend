const ItemsHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: 'items',
  version: '1.0.0',
  register: async (server, { itemsService, requestsService, validator }) => {
    const itemsHandler = new ItemsHandler(itemsService, requestsService, validator);

    server.route(routes(itemsHandler));
  },
};
