const ClientError = require('../../exceptions/ClientError');

class UsersHandler {
  constructor(usersService, tokenManager, validator) {
    this._usersService = usersService;
    this._validator = validator;
    this._tokenManager = tokenManager;

    this.postRegisterHandler = this.postRegisterHandler.bind(this);
    this.postLoginHandler = this.postLoginHandler.bind(this);
    this.patchProfileHandler = this.patchProfileHandler.bind(this);
    this.getUserHandler = this.getUserHandler.bind(this);
    this.deleteAllData = this.deleteAllData.bind(this);
    this.patchTokenHandler = this.patchTokenHandler.bind(this);
    this.patchPhoneHandler = this.patchPhoneHandler.bind(this);
    this.patchPasswordHandler = this.patchPasswordHandler.bind(this);
  }

  async patchPasswordHandler(request, h) {
    try {
      const { username } = request.params;

      await this._usersService.updatePassword(username, request.payload);
      return h.response({
        status: 'success',
        message: 'Berhasil memperbarui password',
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

  async patchTokenHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;

      await this._usersService.updateToken(credentialId, request.payload);

      return h.response({
        status: 'success',
        message: 'Berhasil mengupdate token',
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

  async deleteAllData(request, h) {
    await this._usersService.clearAll();

    return h.response({
      status: 'success',
    });
  }

  async getUserHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;

      const data = await this._usersService.getUser(credentialId);

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

  async postRegisterHandler(request, h) {
    try {
      this._validator.validatorRegisterPayload(request.payload);

      const {
        email, phone, username,
      } = request.payload;

      await this._usersService.verifyEmail(email);
      await this._usersService.verifyPhone(phone);
      await this._usersService.verifyUsername(username);

      const userId = await this._usersService.addUser(request.payload);

      const response = h.response({
        status: 'success',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
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

  async postLoginHandler(request, h) {
    try {
      this._validator.validatorLoginPayload(request.payload);

      const { id, phone } = await this._usersService.verifyUserCredentials(request.payload);
      const accessToken = this._tokenManager.generateAccessToken({ id });

      return h.response({
        status: 'success',
        data: {
          userId: id,
          phone,
          accessToken,
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

  async patchProfileHandler(request, h) {
    try {
      this._validator.validatorUpdatePayload(request.payload);
      const { id: credentialId } = request.auth.credentials;

      const id = await this._usersService.updateProfile(credentialId, request.payload);

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

  async patchPhoneHandler(request, h) {
    try {
      const { id } = request.auth.credentials;

      await this._usersService.verifyPhone(request.payload);
      await this._usersService.updatePhone(id, request.payload);

      return h.response({
        status: 'success',
        message: 'Berhasil memperbarui nomor telepon.',
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

module.exports = UsersHandler;
