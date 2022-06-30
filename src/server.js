require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// Users
const usersPlugin = require('./api/users/index');
const UsersService = require('./services/UsersService');
const UsersValidator = require('./validation/users/index');
const TokenManager = require('./tokenize/TokenManager');

// Items
const itemsPlugin = require('./api/items/index');
const ItemsService = require('./services/ItemsService');
const ItemsValidator = require('./validation/items/index');

// Requests
const requestsPlugin = require('./api/requests/index');
const RequestsService = require('./services/RequestsService');
const RequestsValidator = require('./validation/requests/index');

// Wishlists
const wishlistsPlugin = require('./api/wishlists/index');
const WishlistsService = require('./services/WishlistsService');
const WishlistsValidator = require('./validation/wishlists/index');

// Wishlists
const rewardsPlugin = require('./api/rewards/index');
const RewardsService = require('./services/RewardsService');
const RewardsValidator = require('./validation/rewards/index');

// Advice
const advicesPlugin = require('./api/advice/index');
const AdvicesService = require('./services/AdvicesService');
const AdvicesValidator = require('./validation/advice/index');

// Uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/StorageService');
const UploadsValidator = require('./validation/uploads/index');
const UploadsService = require('./services/UploadsService');

// Chat
const chatPlugin = require('./api/chat/index');
const ChatService = require('./services/ChatService');

// Mail
const mailPlugin = require('./api/mail/index');
const MailSender = require('./services/MailSender');

// Admin
const adminPlugin = require('./api/admin/index');

const init = async () => {
  const usersService = new UsersService();
  const itemsService = new ItemsService();
  const requestsService = new RequestsService();
  const wishlistsService = new WishlistsService();
  const rewardsService = new RewardsService(usersService);
  const advicesService = new AdvicesService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const chatService = new ChatService();
  const uploadsService = new UploadsService(itemsService);
  const mailSender = new MailSender();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('unusedapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: usersPlugin,
      options: {
        usersService,
        tokenManager: TokenManager,
        validator: UsersValidator,
      },
    },
    {
      plugin: itemsPlugin,
      options: {
        itemsService,
        requestsService,
        validator: ItemsValidator,
      },
    },
    {
      plugin: requestsPlugin,
      options: {
        requestsService,
        validator: RequestsValidator,
      },
    },
    {
      plugin: wishlistsPlugin,
      options: {
        wishlistsService,
        validator: WishlistsValidator,
      },
    },
    {
      plugin: rewardsPlugin,
      options: {
        rewardsService,
        storageService,
        validator: RewardsValidator,
      },
    },
    {
      plugin: advicesPlugin,
      options: {
        advicesService,
        validator: AdvicesValidator,
      },
    },
    {
      plugin: chatPlugin,
      options: {
        chatService,
        usersService,
        itemsService,
      },
    },
    {
      plugin: uploads,
      options: {
        storageService,
        uploadsService,
        itemsService,
        requestsService,
        rewardsService,
        validator: UploadsValidator,
      },
    },
    {
      plugin: mailPlugin,
      options: {
        usersService,
        mailSender,
      },
    },
    {
      plugin: adminPlugin,
      options: {
        usersService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
