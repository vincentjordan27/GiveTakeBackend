const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class RequestsService {
  constructor() {
    this._pool = new Pool();
  }

  async checkRequest(userId, itemId) {
    const query = {
      text: 'SELECT * FROM request WHERE user_id = $1 AND item_id = $2',
      values: [userId, itemId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('Anda telah melakukan request menjadi penerima');
    }
  }

  async checkReceiver(userId, itemId) {
    const query = {
      text: 'SELECT * FROM request WHERE user_id = $1 AND item_id = $2 AND status = $3',
      values: [userId, itemId, 1],
    };

    const result = await this._pool.query(query);
    console.log(result.rows);

    if (!result.rows.length) {
      throw new InvariantError('Anda bukan merupakan penerima barang');
    }
  }

  async addRequestItem(userId, itemId, {
    reason,
  }) {
    const id = `request-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO request VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, userId, itemId, reason, 0],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal mengajukan tawaran');
    }

    return result.rows[0].id;
  }

  async deleteRequestItem(userId, itemId) {
    const query = {
      text: 'DELETE FROM request WHERE user_id = $1 AND item_id = $2 RETURNING id',
      values: [userId, itemId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Tawaran gagal dihapus');
    }

    return result.rows[0].id;
  }

  async updateReceiverItem(itemId, { requestId }) {
    const updateOther = {
      text: 'UPDATE request SET status = 2 WHERE id <> $1 AND item_id = $2 RETURNING id',
      values: [requestId, itemId],
    };

    await this._pool.query(updateOther);

    const query = {
      text: 'UPDATE request SET status = 1 WHERE id = $1 RETURNING id',
      values: [requestId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Terjadi kesalahan. Silahkan coba kembali');
    }
  }

  async updateDoneItem(userId, itemId) {
    const query = {
      text: 'UPDATE request SET status = 3 WHERE user_id = $1 AND item_id = $2 RETURNING id',
      values: [userId, itemId],
    };

    const result = await this._pool.query(query);

    const deleteChat = {
      text: 'DELETE FROM chat WHERE item_id = $1',
      values: [itemId],
    };

    await this._pool.query(deleteChat);

    const userQuery = {
      text: `SELECT users.id, users.point FROM users 
      JOIN items
      ON users.id = items.user_id
      WHERE items.id = $1`,
      values: [itemId],
    };

    const resultUser = await this._pool.query(userQuery);
    const point = parseInt(resultUser.rows[0].point, 10) + 25;
    console.log(point);
    const userOwner = resultUser.rows[0].id;

    const updateQuery = {
      text: 'UPDATE users SET point = $1 WHERE id = $2 RETURNING id',
      values: [point, userOwner],
    };

    const update = await this._pool.query(updateQuery);

    if (!result.rows.length || !update.rows.length) {
      throw new InvariantError('Terjadi kesalahan. Silahkan coba kembali');
    }
  }
}

module.exports = RequestsService;
