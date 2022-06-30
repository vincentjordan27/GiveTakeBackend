const ClientError = require('../../exceptions/ClientError');

class ChatHandler {
  constructor(chatService, usersService, itemsService) {
    this._chatService = chatService;
    this._usersService = usersService;
    this._itemsService = itemsService;

    this.postChatHandler = this.postChatHandler.bind(this);
    this.deleteChatHandler = this.deleteChatHandler.bind(this);
    this.getChatHandler = this.getChatHandler.bind(this);
    this.patchChatHandler = this.patchChatHandler.bind(this);
  }

  async postChatHandler(request, h) {
    try {
      const { id } = request.auth.credentials;
      const { receiverId, itemsId } = request.payload;

      await this._usersService.verifyUserId(id);
      await this._usersService.verifyUserId(receiverId);
      await this._itemsService.verifyItemId(itemsId);
      const chatId = await this._chatService.createChat(id, request.payload);

      return h.response({
        status: 'success',
        chatId,
      });
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteChatHandler(request, h) {
    try {
      const { id } = request.params;

      await this._chatService.verifyChatId(id);
      await this._chatService.deleteChat(id);

      return h.response({
        status: 'success',
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async patchChatHandler(request, h) {
    try {
      const { id } = request.params;

      await this._chatService.verifyChatId(id);
      await this._chatService.updateValidChat(id);

      return h.response({
        status: 'success',
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getChatHandler(request, h) {
    try {
      const { id } = request.auth.credentials;
      await this._usersService.verifyUserId(id);

      const data = await this._chatService.getChatList(id);

      return h.response({
        status: 'success',
        data,
      });
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ChatHandler;
