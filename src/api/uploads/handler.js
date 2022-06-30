/* eslint-disable max-len */
const ClientError = require('../../exceptions/ClientError');

class UploadsHandler {
  constructor(storageService, uploadsService, itemsService, requestsService, rewardsService, validator) {
    this._storageService = storageService;
    this._uploadsService = uploadsService;
    this._rewardsService = rewardsService;
    this._itemsService = itemsService;
    this._requestsService = requestsService;
    this._validator = validator;

    this.postUploadItemImageHandler = this.postUploadItemImageHandler.bind(this);
    this.postUploadUlasanImageHandler = this.postUploadUlasanImageHandler.bind(this);
    this.postUploadRewardImageHandler = this.postUploadRewardImageHandler.bind(this);
    this.deleteUploadItemImageHandler = this.deleteUploadItemImageHandler.bind(this);
    this.deleteUploadUlasanImageHandler = this.deleteUploadUlasanImageHandler.bind(this);
    this.postUploadUserImageHandler = this.postUploadUserImageHandler.bind(this);
  }

  async postUploadUserImageHandler(request, h) {
    try {
      const { data } = request.payload;
      const fileLocation = await this._storageService.writeFile(data, data.hapi);
      // const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

      const response = h.response({
        status: 'success',
        url: fileLocation,
      }).code(201);
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

  async postUploadItemImageHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      const { data } = request.payload;

      const fileLocation = await this._storageService.writeFile(data, data.hapi);
      // const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
      const imageId = await this._uploadsService.addItemPhoto(fileLocation, credentialId, id);
      const response = h.response({
        status: 'success',
        data: {
          imageId,
          fileLocation,
        },
      }).code(201);
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

  async postUploadRewardImageHandler(request, h) {
    try {
      const { data } = request.payload;
      // const filename = await this._storageService.writeFileLocal(data, data.hapi);
      // const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

      const fileLocation = await this._storageService.writeFile(data, data.hapi);
      return h.response({
        status: 'success',
        data: {
          url: fileLocation,
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

  async postUploadUlasanImageHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      const { data } = request.payload;

      await this._requestsService.checkReceiver(credentialId, id);

      const fileLocation = await this._storageService.writeFile(data, data.hapi);
      // const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
      const imageId = await this._uploadsService.addUlasanPhoto(fileLocation, id);
      return h.response({
        status: 'success',
        data: {
          imageId,
          fileLocation,
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

  async deleteUploadItemImageHandler(request, h) {
    try {
      this._validator.validateDeleteImage(request.payload);

      const fileLocation = await this._uploadsService.getItemPhotoUrl(request.payload);
      await this._uploadsService.deleteItemPhoto(request.payload);
      await this._storageService.removeFile(fileLocation);

      return h.response({
        status: 'success',
        message: 'Berhasil menghapus gambar',
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

  async deleteUploadUlasanImageHandler(request, h) {
    try {
      this._validator.validateDeleteImage(request.payload);
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._requestsService.checkReceiver(credentialId, id);
      const fileLocation = await this._uploadsService.getUlasanPhotoUrl(request.payload);
      await this._uploadsService.deleteUlasanPhoto(request.payload);
      await this._storageService.removeFile(fileLocation);

      return h.response({
        status: 'success',
        message: 'Berhasil menghapus gambar',
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

module.exports = UploadsHandler;
