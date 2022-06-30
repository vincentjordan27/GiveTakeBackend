const AdvicesHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: 'advice',
  version: '1.0.0',
  register: async (server, { advicesService, validator }) => {
    const advicesHandler = new AdvicesHandler(advicesService, validator);

    server.route(routes(advicesHandler));
  },
};
