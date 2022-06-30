const UsersHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { usersService, tokenManager, validator }) => {
    const userHandler = new UsersHandler(usersService, tokenManager, validator);

    server.route(routes(userHandler));
  },
};
