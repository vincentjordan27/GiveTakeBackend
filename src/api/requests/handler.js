const ClientError = require('../../exceptions/ClientError');

class RequestHandler {
  constructor(requestsService, validator) {
    this._requestsService = requestsService;
    this._validator = validator;

    this.postRequestHandler = this.postRequestHandler.bind(this);
    this.deleteRequestHandler = this.deleteRequestHandler.bind(this);
  }

  async postRequestHandler(request, h) {
    try {
      this._validator.validatorRequestPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { id } = request.params;

      await this._requestsService.checkRequest(credentialId, id);
      const result = await this._requestsService.addRequestItem(credentialId, id, request.payload);

      return h.response({
        status: 'success',
        data: {
          requestId: result,
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

  async deleteRequestHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id } = request.params;

      const requestId = await this._requestsService.deleteRequestItem(credentialId, id);

      return h.response({
        status: 'success',
        data: {
          requestId,
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
}

module.exports = RequestHandler;
