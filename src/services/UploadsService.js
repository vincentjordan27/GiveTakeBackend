const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class UploadsService {
  constructor() {
    this._pool = new Pool();
  }

  async addItemPhoto(url, userId, itemId) {
    const id = `photo-item-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO item_photos VALUES ($1, $2, $3) RETURNING id',
      values: [id, itemId, url],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Tidak dapat mengupload foto. Silahkan dicoba kembali');
    }

    return result.rows[0].id;
  }

  async getItemPhotoUrl({ imageId }) {
    const query = {
      text: 'SELECT url FROM item_photos WHERE id = $1',
      values: [imageId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Foto tidak ditemukan');
    }

    return result.rows[0].url;
  }

  async deleteItemPhoto({ imageId }) {
    const query = {
      text: 'DELETE FROM item_photos WHERE id = $1 RETURNING id',
      values: [imageId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Tidak dapat menghapus foto. Silahkan dicoba kembali');
    }
  }

  async addUlasanPhoto(url, itemId) {
    const id = `photo-ulasan-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO ulasan_photo VALUES ($1, $2, $3) RETURNING id',
      values: [id, itemId, url],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Tidak dapat mengupload foto. Silahkan dicoba kembali');
    }

    return result.rows[0].id;
  }

  async getUlasanPhotoUrl({ imageId }) {
    const query = {
      text: 'SELECT url FROM ulasan_photo WHERE id = $1',
      values: [imageId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Foto tidak ditemukan');
    }

    return result.rows[0].url;
  }

  async deleteUlasanPhoto({ imageId }) {
    const query = {
      text: 'DELETE FROM ulasan_photo WHERE id = $1 RETURNING id',
      values: [imageId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Tidak dapat menghapus foto. Silahkan dicoba kembali');
    }
  }
}

module.exports = UploadsService;
