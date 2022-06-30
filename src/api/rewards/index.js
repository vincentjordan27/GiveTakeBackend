const RewardsHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: 'rewards',
  version: '1.0.0',
  register: async (server, { rewardsService, storageService, validator }) => {
    const rewardsHandler = new RewardsHandler(rewardsService, storageService, validator);

    server.route(routes(rewardsHandler));
  },
};
