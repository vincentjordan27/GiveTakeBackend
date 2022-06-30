const ClientError = require('../../exceptions/ClientError');

class AdminHandler {
  constructor(usersService) {
    this._usersService = usersService;
    this.postLoginAdminHandler = this.postLoginAdminHandler.bind(this);
  }

  async postLoginAdminHandler(request, h) {
    try {
      const email = await this._usersService.verifyAdminCredential(request.payload);

      return h.response({
        status: 'success',
        email,
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

module.exports = AdminHandler;
