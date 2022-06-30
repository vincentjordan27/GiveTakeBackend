const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/upload/item/image/{id}',
    handler: handler.postUploadItemImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 5242880,
      },
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/upload/ulasan/image/{id}',
    handler: handler.postUploadUlasanImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 5242880,
      },
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/upload/reward/image',
    handler: handler.postUploadRewardImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 5242880,
      },
    },
  },
  {
    method: 'POST',
    path: '/upload/user',
    handler: handler.postUploadUserImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 5242880,
      },
    },
  },
  {
    method: 'DELETE',
    path: '/upload/item/image/{id}',
    handler: handler.deleteUploadItemImageHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/upload/ulasan/image/{id}',
    handler: handler.deleteUploadUlasanImageHandler,
    options: {
      auth: 'unusedapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file'),
      },
    },
  },
];

module.exports = routes;
