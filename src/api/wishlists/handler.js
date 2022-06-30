const ClientError = require('../../exceptions/ClientError');

class WishlistsHandler {
  constructor(wishlistsService, validator) {
    this._wishlistsService = wishlistsService;
    this._validator = validator;

    this.postWishlistHandler = this.postWishlistHandler.bind(this);
    this.deleteWishlistHandle = this.deleteWishlistHandle.bind(this);
    this.getWishlistHandler = this.getWishlistHandler.bind(this);
  }

  async postWishlistHandler(request, h) {
    try {
      this._validator.validatorWishlistPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { itemId } = request.payload;

      await this._wishlistsService.checkWishlist(credentialId, itemId);
      const id = await this._wishlistsService.addWishlist(credentialId, request.payload);

      return h.response({
        status: 'success',
        data: {
          id,
        },
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

  async deleteWishlistHandle(request, h) {
    try {
      this._validator.validatorWishlistPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;

      const id = await this._wishlistsService.deleteWishlist(credentialId, request.payload);

      return h.response({
        status: 'success',
        data: {
          id,
        },
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

  async getWishlistHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;

      const data = await this._wishlistsService.getWishlist(credentialId);

      return {
        status: 'success',
        data,
      };
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

module.exports = WishlistsHandler;
