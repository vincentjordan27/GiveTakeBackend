const routes = (handler) => [
  {
    method: 'POST',
    path: '/chat',
    handler: handler.postChatHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/chat/{id}',
    handler: handler.deleteChatHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'PATCH',
    path: '/chat/{id}',
    handler: handler.patchChatHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/chat',
    handler: handler.getChatHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
];

module.exports = routes;
