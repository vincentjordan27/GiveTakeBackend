const ChatHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: 'chat',
  version: '1.0.0',
  register: async (server, { chatService, usersService, itemsService }) => {
    const chatHandler = new ChatHandler(chatService, usersService, itemsService);

    server.route(routes(chatHandler));
  },
};
