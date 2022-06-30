/* eslint-disable function-paren-newline */
const UploadsHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, {
    storageService, uploadsService, itemsService, requestsService, rewardsService, validator,
  }) => {
    const uploadsHandler = new UploadsHandler(
      storageService, uploadsService, itemsService, requestsService, rewardsService, validator,
    );
    server.route(routes(uploadsHandler));
  },
};
