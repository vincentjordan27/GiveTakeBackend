const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');
const NotFoundError = require('../exceptions/NotFoundError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async clearAll() {
    await this._pool.query('TRUNCATE TABLE advice, advice_photo, item_photos, items, request, review, review_photo, rewards, ulasan_photo, user_reward, users, wishlist, chat');
  }

  async updateToken(userId, { token }) {
    const query = {
      text: 'UPDATE users SET token = $1 WHERE id =  $2 RETURNING id',
      values: [token, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async verifyUserId(userId) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async getEmailUser(id) {
    const query = {
      text: 'SELECT email FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0].email;
  }

  async getEmailBasedUsername(username) {
    const query = {
      text: 'SELECT email FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0].email;
  }

  async getUser(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  async verifyEmail(email) {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('Email sudah digunakan');
    }
  }

  async verifyPhone({ phone }) {
    const query = {
      text: 'SELECT * FROM users WHERE phone = $1',
      values: [phone],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('Nomor telepon sudah digunakan');
    }
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('Username sudah digunakan');
    }
  }

  async addUser({
    username, name, email, password, phone, latitude = null,
    longitude = null, address, photo,
  }) {
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id',
      values: [id, name, username, 0, email, hashedPassword, phone, longitude, latitude, address, photo],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan user');
    }

    return result.rows[0].id;
  }

  async updatePassword(username, { password }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'UPDATE users SET password = $1 WHERE username = $2 RETURNING id',
      values: [hashedPassword, username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal mengubah password');
    }
  }

  async verifyUserCredentials({
    username, password,
  }) {
    const query = {
      text: 'SELECT id, password, phone FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, phone, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return { id, phone };
  }

  async verifyAdminCredential({ username, password }) {
    const query = {
      text: 'SELECT password, email FROM admin WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { email, password: passwordAdmin } = result.rows[0];
    const match = password === passwordAdmin;

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return email;
  }

  async updatePoint(id, point) {
    const query = {
      text: 'UPDATE users SET point = $1 WHERE id = $2 RETURNING id',
      values: [point, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Poin gagal diupdate');
    }
  }

  async updatePhone(id, { phone }) {
    const query = {
      text: 'UPDATE users SET phone = $1 WHERE id = $2 RETURNING id',
      values: [phone, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Nomor telepon gagal diupdate');
    }
  }

  async updateProfile(id, {
    name, oldpassword, newpassword, longitude, latitude, address, photo,
  }) {
    const query = {
      text: 'SELECT id, password FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Password lama anda salah');
    }

    const { password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(oldpassword, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const hashedNewPassword = await bcrypt.hash(newpassword, 10);

    const queryUpdate = {
      text: 'UPDATE users SET name = $1, password = $2, longitude = $3, latitude = $4, address = $5, photo = $6 WHERE id = $7 RETURNING id',
      values: [name, hashedNewPassword, longitude, latitude, address, photo, id],
    };

    const update = await this._pool.query(queryUpdate);

    if (!update.rows.length) {
      throw new InvariantError('Gagal mengupdate profil');
    }

    return result.rows[0].id;
  }
}

module.exports = UsersService;
