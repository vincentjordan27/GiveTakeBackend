const ClientError = require('../../exceptions/ClientError');

class AdvicesHandler {
  constructor(advicesService, validator) {
    this._advicesService = advicesService;
    this._validator = validator;

    this.postAdviceHandler = this.postAdviceHandler.bind(this);
    this.getMyAdvicesHandler = this.getMyAdvicesHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.getAdvicesHandler = this.getAdvicesHandler.bind(this);
  }

  async postAdviceHandler(request, h) {
    try {
      this._validator.validatorAdvicePayload(request.payload);
      const { id } = request.auth.credentials;

      const adviceId = await this._advicesService.addAdvice(id, request.payload);

      return h.response({
        status: 'success',
        data: {
          adviceId,
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

  async getMyAdvicesHandler(request, h) {
    try {
      const { id } = request.auth.credentials;
      const data = await this._advicesService.getMyAdvice(id);

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

  async getAdvicesHandler(request, h) {
    try {
      const data = await this._advicesService.getAllAdvices();

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

  async postReplyHandler(request, h) {
    try {
      const { id } = request.params;

      await this._advicesService.replyAdvice(id, request.payload);

      return h.response({
        status: 'success',
        message: 'Berhasil membalas saran dan keluhan',
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

module.exports = AdvicesHandler;
