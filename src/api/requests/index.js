const RequestHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: 'request',
  version: '1.0.0',
  register: async (server, { requestsService, validator }) => {
    const requetsHandler = new RequestHandler(requestsService, validator);

    server.route(routes(requetsHandler));
  },
};
