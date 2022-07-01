const ClientError = require('../../exceptions/ClientError');

class RewardsHandler {
  constructor(rewardsService, storageService, validator) {
    this._rewardsService = rewardsService;
    this._validator = validator;
    this._storageService = storageService;

    this.postRewardHandler = this.postRewardHandler.bind(this);
    this.getRewardsHandler = this.getRewardsHandler.bind(this);
    this.getRewardByIdHandler = this.getRewardByIdHandler.bind(this);
    this.postRedeemHandler = this.postRedeemHandler.bind(this);
    this.getMyRewardsHandler = this.getMyRewardsHandler.bind(this);
    this.updateRewardHandler = this.updateRewardHandler.bind(this);
    this.getRewardRequestHandler = this.getRewardRequestHandler.bind(this);
    this.postFinishRewardRequest = this.postFinishRewardRequest.bind(this);
    this.deleteRewardHandler = this.deleteRewardHandler.bind(this);
    this.getRewardByIdAdminHandler = this.getRewardByIdAdminHandler.bind(this);
  }

  async postFinishRewardRequest(request, h) {
    try {
      const { id } = request.params;

      await this._rewardsService.finishRequestReward(id);

      return h.response({
        status: 'success',
        message: 'Berhasil menyelesaikan permintaan hadiah',
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

  async postRewardHandler(request, h) {
    try {
      this._validator.validatorRewardPayload(request.payload);

      const id = await this._rewardsService.addReward(request.payload);

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

  async getRewardsHandler(request, h) {
    try {
      const data = await this._rewardsService.getRewards();

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

  async getRewardByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      const { data, valid, point } = await this._rewardsService.getRewardById(credentialId, id);

      return h.response({
        status: 'success',
        data,
        valid,
        point,
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

  async getRewardByIdAdminHandler(request, h) {
    try {
      const { id } = request.params;
      const data = await this._rewardsService.getRewardByIdAdmin(id);

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

  async postRedeemHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id } = request.params;
      const redeemId = await this._rewardsService.redeemReward(credentialId, id, request.payload);

      return h.response({
        status: 'success',
        data: {
          redeemId,
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

  async getMyRewardsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;

      const data = await this._rewardsService.getMyReward(credentialId);

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

  async updateRewardHandler(request, h) {
    try {
      this._validator.validatorRewardPayload(request.payload);

      const { id } = request.params;

      const rewardId = await this._rewardsService.editReward(id, request.payload);

      return h.response({
        status: 'success',
        data: {
          rewardId,
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

  async getRewardRequestHandler(request, h) {
    try {
      const data = await this._rewardsService.getAllRewardRequest();

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

  async deleteRewardHandler(request, h) {
    try {
      const { id } = request.params;

      await this._rewardsService.deleteReward(id);

      return h.response({
        status: 'success',
        message: 'Berhasil menghapus hadiah',
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

module.exports = RewardsHandler;
