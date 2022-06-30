const AdminHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: 'admin',
  version: '1.0.0',
  register: async (server, { usersService }) => {
    const adminHandler = new AdminHandler(usersService);

    server.route(routes(adminHandler));
  },
};
