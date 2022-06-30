const routes = require('./route');
const MailHandler = require('./handler');

module.exports = {
  name: 'mail',
  version: '1.0.0',
  register: async (server, { usersService, mailSender }) => {
    const mailHandler = new MailHandler(usersService, mailSender);

    server.route(routes(mailHandler));
  },
};
