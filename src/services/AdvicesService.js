const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class AdvicesService {
  constructor() {
    this._pool = new Pool();
  }

  async addAdvice(userId, {
    title, category, desc, reply = '',
  }) {
    const months = ['Januari', 'Febuari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();

    const year = date.getFullYear();

    const addDate = `${day} ${months[month]} ${year}`;

    const id = `advice-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO advice VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, category, desc, reply, userId, addDate],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal mengirimkan kritik dan saran');
    }

    return result.rows[0].id;
  }

  async getMyAdvice(id) {
    const query = {
      text: 'SELECT * FROM advice WHERE user_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getAllAdvices() {
    const query = {
      text: `SELECT advice.*, users.name FROM advice
      JOIN users
      ON advice.user_id = users.id
      WHERE reply = $1`,
      values: [''],
    };

    const results = await this._pool.query(query);
    return results.rows;
  }

  async replyAdvice(id, { reply }) {
    const query = {
      text: 'UPDATE advice SET reply = $1 WHERE id = $2 RETURNING id',
      values: [reply, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal membalas saran dan kritik');
    }
  }
}

module.exports = AdvicesService;
