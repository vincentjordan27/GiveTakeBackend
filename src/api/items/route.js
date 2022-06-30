const routes = (handler) => [
  {
    method: 'GET',
    path: '/itemid',
    handler: handler.getItemIdHandler,
  },
  {
    method: 'POST',
    path: '/filter',
    handler: handler.getItemsFilterHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/search',
    handler: handler.getItemsSearchHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/itemsLog',
    handler: handler.getItemsLoginHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/item/{id}',
    handler: handler.getItemByIdHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/myitems',
    handler: handler.getMyItemsHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/myoffers',
    handler: handler.getMyOffersHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/choose/{id}',
    handler: handler.getChooseHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/item',
    handler: handler.postItemHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'PATCH',
    path: '/item/{id}',
    handler: handler.updateItemHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/item/{id}',
    handler: handler.deleteItemHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/choose/{id}',
    handler: handler.postChooseHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/receive/{id}',
    handler: handler.postReceiveHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
];

module.exports = routes;
