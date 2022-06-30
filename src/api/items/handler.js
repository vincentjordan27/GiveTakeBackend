const ClientError = require('../../exceptions/ClientError');

class ItemsHandler {
  constructor(itemsService, requestsService, validator) {
    this._itemsService = itemsService;
    this._validator = validator;
    this._requestsService = requestsService;

    this.getItemIdHandler = this.getItemIdHandler.bind(this);
    this.postItemHandler = this.postItemHandler.bind(this);
    this.updateItemHandler = this.updateItemHandler.bind(this);
    this.deleteItemHandler = this.deleteItemHandler.bind(this);
    this.getItemsLoginHandler = this.getItemsLoginHandler.bind(this);
    this.getItemByIdHandler = this.getItemByIdHandler.bind(this);
    this.getMyItemsHandler = this.getMyItemsHandler.bind(this);
    this.getMyOffersHandler = this.getMyOffersHandler.bind(this);
    this.getChooseHandler = this.getChooseHandler.bind(this);
    this.postChooseHandler = this.postChooseHandler.bind(this);
    this.postReceiveHandler = this.postReceiveHandler.bind(this);
    this.getItemsFilterHandler = this.getItemsFilterHandler.bind(this);
    this.getItemsSearchHandler = this.getItemsSearchHandler.bind(this);
  }

  async getItemsFilterHandler(request, h) {
    try {
      const { id } = request.auth.credentials;

      const data = await this._itemsService.getItemWithFilter(id, request.payload);

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

  async getItemsSearchHandler(request, h) {
    try {
      const { id } = request.auth.credentials;
      const { query } = request.query;
      console.log(query);

      const data = await this._itemsService.getSearchItems(id, query);

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

  async getItemIdHandler(request, h) {
    try {
      const id = await this._itemsService.generateIdItem();

      return {
        status: 'success',
        data: {
          itemId: id,
        },
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

  async postItemHandler(request, h) {
    try {
      this._validator.validatorItemPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const name = await this._itemsService.addItem(credentialId, request.payload);
      console.log(request.payload);
      return h.response({
        status: 'success',
        data: {
          name,
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

  async updateItemHandler(request, h) {
    try {
      this._validator.validatorItemPayload(request.payload);

      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._itemsService.verifyItemOwner(id, credentialId);
      const name = await this._itemsService.updateItem(id, request.payload);

      return h.response({
        status: 'success',
        data: {
          name,
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

  async deleteItemHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._itemsService.verifyItemOwner(id, credentialId);
      await this._itemsService.verifyStatusItem(id);
      const name = await this._itemsService.deleteItem(id);

      return h.response({
        status: 'success',
        data: {
          name,
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

  async getItemsLoginHandler(request, h) {
    try {
      const { id } = request.auth.credentials;

      const data = await this._itemsService.getAllItemsWithRadius(id);

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

  async getItemByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentials } = request.auth.credentials;

      const data = await this._itemsService.getItemById(id, credentials);

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

  async getMyItemsHandler(request, h) {
    try {
      const { id } = request.auth.credentials;
      const data = await this._itemsService.getMyItems(id);

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

  async getMyOffersHandler(request, h) {
    try {
      const { id } = request.auth.credentials;

      const data = await this._itemsService.getMyOffers(id);

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

  async getChooseHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id } = request.params;
      await this._itemsService.verifyItemOwner(id, credentialId);

      const data = await this._itemsService.getMyItemInterest(id, credentialId);

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

  async postChooseHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id } = request.params;

      await this._itemsService.verifyItemOwner(id, credentialId);
      await this._requestsService.updateReceiverItem(id, request.payload);
      await this._itemsService.updateStatus(id, 1, '');

      return h.response({
        status: 'success',
        message: 'Berhasil memilih penerima barang',
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

  async postReceiveHandler(request, h) {
    try {
      this._validator.validatorReceiveItemPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;

      const { id } = request.params;

      await this._requestsService.checkReceiver(credentialId, id);
      await this._requestsService.updateDoneItem(credentialId, id);
      await this._itemsService.updateStatus(id, 2, request.payload);

      return h.response({
        status: 'success',
        message: 'Berhasil menerima barang',
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
}

module.exports = ItemsHandler;
