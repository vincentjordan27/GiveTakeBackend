const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const {
  mapDbtoItemLogin,
} = require('../utils/index');

class WishlistsService {
  constructor() {
    this._pool = new Pool();
  }

  async checkWishlist(userId, itemId) {
    const query = {
      text: 'SELECT * FROM wishlist WHERE user_id = $1 AND item_id = $2',
      values: [userId, itemId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('Item sudah berada dalam wishlist');
    }
  }

  async getWishlist(userId) {
    const query = {
      text: `SELECT items.* FROM wishlist
      JOIN items
      ON wishlist.item_id = items.id
      WHERE wishlist.user_id = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    const user = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };

    const userResult = await this._pool.query(user);

    return result.rows.map((item) => mapDbtoItemLogin(userResult.rows[0], item));
  }

  async addWishlist(userId, {
    itemId,
  }) {
    const id = `wish-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO wishlist VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, itemId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan ke wishlist');
    }

    return result.rows[0].id;
  }

  async deleteWishlist(id, {
    itemId,
  }) {
    const query = {
      text: 'DELETE FROM wishlist WHERE user_id = $1 AND item_id = $2 RETURNING id',
      values: [id, itemId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus dari wishlist');
    }

    return result.rows[0].id;
  }
}

module.exports = WishlistsService;
