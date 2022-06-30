const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');
const {
  mapDbtoItemLogin, mapDBToItemById, mapDBToReceiverList,
} = require('../utils/index');

class ItemsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyItemId(itemId) {
    const query = {
      text: 'SELECT * FROM items WHERE id = $1',
      values: [itemId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Item tidak ditemukan');
    }
  }

  async getAllItemsWithRadius(userId) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };

    const user = await this._pool.query(query);

    if (!user.rows.length) {
      throw new AuthorizationError('Kredensial yang anda berikan salah');
    }

    const itemsQuery = {
      text: 'SELECT * FROM items WHERE user_id <> $1 AND status = 0',
      values: [userId],
    };

    const items = await this._pool.query(itemsQuery);

    return items.rows.map((item) => mapDbtoItemLogin(user.rows[0], item));
  }

  async getSearchItems(userId, search) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };

    const user = await this._pool.query(query);

    if (!user.rows.length) {
      throw new AuthorizationError('Kredensial yang anda berikan salah');
    }

    const queryText = `%${search}%`;

    const itemsQuery = {
      text: 'SELECT * FROM items WHERE user_id <> $1 AND status = 0 AND UPPER(name) LIKE UPPER($2)',
      values: [userId, queryText],
    };

    const items = await this._pool.query(itemsQuery);

    return items.rows.map((item) => mapDbtoItemLogin(user.rows[0], item));
  }

  async getItemWithFilter(userId, { category, maxRadius }) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };

    const user = await this._pool.query(query);

    if (!user.rows.length) {
      throw new AuthorizationError('Kredensial yang anda berikan salah');
    }

    const itemQuery = {
      text: 'SELECT * FROM items  WHERE user_id <> $1 AND status = 0 AND category = $2',
      values: [userId, category],
    };

    const result = await this._pool.query(itemQuery);

    const mapping = result.rows.map((item) => mapDbtoItemLogin(user.rows[0], item));
    return mapping.filter((data) => parseFloat(data.distance) <= parseFloat(maxRadius));
  }

  async getItemById(id, userId) {
    const userDataQuery = {
      text: 'SELECT name, address, longitude, latitude, token FROM users WHERE id = $1',
      values: [userId],
    };

    const resultUserData = await this._pool.query(userDataQuery);

    const query = {
      text: `SELECT items.*, users.token, users.name as owner FROM items 
      JOIN users
      ON users.id = items.user_id
      WHERE items.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    const queryImage = {
      text: 'SELECT id, url FROM item_photos WHERE item_id = $1',
      values: [id],
    };

    const resultImage = await this._pool.query(queryImage);

    const queryImageUlasan = {
      text: 'SELECT id, url FROM ulasan_photo WHERE item_id = $1',
      values: [id],
    };

    const imageUlasan = await this._pool.query(queryImageUlasan);

    if (!result.rows.length) {
      throw new NotFoundError('Item tidak ditemukan');
    } else if (userId === undefined) {
      return mapDBToItemById(result.rows, 0, false, resultUserData.rows[0].name, resultUserData.rows[0].token, resultUserData.rows[0].address, resultUserData.rows[0].latitude, resultUserData.rows[0].longitude, resultImage.rows, imageUlasan.rows);
    }
    const request = {
      text: 'SELECT * FROM request WHERE user_id = $1 AND item_id = $2',
      values: [userId, id],
    };
    const resultRequest = await this._pool.query(request);

    const wishlist = {
      text: 'SELECT * FROM wishlist WHERE user_id = $1 AND item_id = $2',
      values: [userId, id],
    };
    const resultWishlist = await this._pool.query(wishlist);
    const wish = resultWishlist.rowCount > 0;

    if (!resultRequest.rows.length) {
      return mapDBToItemById(result.rows, -1, '', wish, resultUserData.rows[0].name, resultUserData.rows[0].token, resultUserData.rows[0].address, resultUserData.rows[0].latitude, resultUserData.rows[0].longitude, resultImage.rows, imageUlasan.rows);
    }

    // request: status user terhadap barang
    return mapDBToItemById(result.rows, resultRequest.rows[0].status, resultRequest.rows[0].id, wish, resultUserData.rows[0].name, resultUserData.rows[0].token, resultUserData.rows[0].address, resultUserData.rows[0].latitude, resultUserData.rows[0].longitude, resultImage.rows, imageUlasan.rows);
  }

  async generateIdItem() {
    let id = `item-${nanoid(16)}`;

    const query = {
      text: 'SELECT * FROM items WHERE id = $1',
      values: [id],
    };
    while (true) {
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        break;
      } else {
        id = `item-${nanoid(16)}`;
      }
    }

    return id;
  }

  async addItem(userId, {
    id, name, desc, category, address, latitude, longitude, maxRadius, status = 0, thumbnail,
  }) {
    // const today = new Date();
    // const dd = String(today.getDate()).padStart(2, '0');
    // const mm = String(today.getMonth() + 1).padStart(2, '0');
    // const yyyy = today.getFullYear();

    // const fullDate = `${yyyy}-${mm}-${dd}`;

    const query = {
      text: 'INSERT INTO items VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING name',
      values: [id, name, desc, category, userId, latitude, longitude, maxRadius, status, address, null, thumbnail],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan item');
    }

    return result.rows[0].name;
  }

  async verifyItemOwner(itemId, ownerId) {
    const query = {
      text: 'SELECT * FROM items WHERE id = $1',
      values: [itemId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Item tidak ditemukan');
    }

    const owner = result.rows[0].user_id;
    if (owner !== ownerId) {
      throw new AuthorizationError('Anda tidak memiliki hak akses');
    }
  }

  async verifyStatusItem(itemId) {
    const query = {
      text: 'SELECT * FROM items WHERE id = $1',
      values: [itemId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].status > 0) {
      throw new InvariantError('Transaksi sedang berlangsung');
    }
  }

  async updateItem(id, {
    name, desc, category, address, latitude, longitude, maxRadius, status, thumbnail,
  }) {
    const query = {
      text: 'UPDATE items SET name = $1, description = $2, category = $3, latitude = $4, longitude = $5, max_radius = $6, status = $7, thumbnail = $8, address = $9 WHERE id = $10 RETURNING name',
      values: [name, desc, category, latitude, longitude, maxRadius, status, thumbnail, address, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal mengupdate item');
    }

    return result.rows[0].name;
  }

  async updateStatus(id, status, { ulasan }) {
    const query = {
      text: 'UPDATE items SET status = $1, ulasan = $2 WHERE id = $3 RETURNING id',
      values: [status, ulasan, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Terjadi kesalahan. Silahkan dicoba lagi');
    }
  }

  async deleteItem(id) {
    const query = {
      text: 'DELETE FROM items WHERE id = $1 RETURNING name',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus item');
    }

    return result.rows[0].name;
  }

  async getMyItems(id) {
    const query = {
      text: `SELECT items.id as "ItemId", items.status, count(reason) as "total", items.thumbnail, items.name 
      FROM items 
      LEFT JOIN request
      ON items.id = request.item_id
      WHERE items.user_id = $1
      GROUP BY items.id
      ORDER BY items.updated DESC`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getMyItemInterest(itemId, userId) {
    const query = {
      text: `SELECT items.id as "itemId", items.status, items.latitude, items.longitude,
      users.id as "userId", users.name, users.latitude as "uLatitude", 
      users.longitude as "uLongitude" , users.photo, request.id as "requestId", request.reason FROM items 
      LEFT JOIN request
      ON items.id = request.item_id
      JOIN users
      ON request.user_id = users.id
      WHERE items.user_id = $1 AND items.id = $2`,
      values: [userId, itemId],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapDBToReceiverList);
  }

  async getMyOffers(id) {
    const query = {
      text: `SELECT request.*, items.thumbnail, items.name FROM request 
      JOIN items 
      ON request.item_id = items.id
      WHERE request.user_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ItemsService;
