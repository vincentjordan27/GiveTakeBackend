const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class RewardsService {
  constructor(usersService) {
    this._pool = new Pool();
    this._usersService = usersService;
  }

  async addReward({
    name, photo, stock, desc, price,
  }) {
    const id = `reward-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO rewards VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, name, photo, desc, price, stock],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan reward');
    }

    return result.rows[0].id;
  }

  async getRewards() {
    const result = await this._pool.query('SELECT * FROM rewards ORDER BY stock DESC');

    return result.rows;
  }

  async getRewardById(userId, id) {
    const queryRequest = {
      text: 'SELECT COUNT(*) as "total" FROM user_reward WHERE reward_id = $1 AND user_id = $2 AND status = 0',
      values: [id, userId],
    };

    const total = await this._pool.query(queryRequest);

    const query = {
      text: 'SELECT * FROM rewards WHERE id =  $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Reward tidak ditemukan');
    }

    const userPointQuery = {
      text: 'SELECT point FROM users WHERE id = $1',
      values: [userId],
    };

    const resultPoint = await this._pool.query(userPointQuery);

    if (!resultPoint.rows.length) {
      throw new InvariantError('User tidak ditemukan');
    }

    return { data: result.rows[0], valid: total.rows[0].total > 0, point: resultPoint.rows[0].point };
  }

  async getMyReward(id) {
    const query = {
      text: `SELECT user_reward.id, rewards.name, user_reward.date, rewards.photo, user_reward.status FROM user_reward
      JOIN rewards
      ON user_reward.reward_id = rewards.id
      WHERE user_reward.user_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  // Poin user setelah dikurangi
  async redeemReward(userId, rewardId, { desc, totalPoint }) {
    const id = `user-reward-${nanoid(16)}`;

    const reward = {
      text: 'SELECT * FROM rewards WHERE id = $1',
      values: [rewardId],
    };

    const dataReward = await this._pool.query(reward);

    if (!dataReward.rows.length) {
      throw new NotFoundError('Reward tidak ditemukan');
    }

    const months = ['Januari', 'Febuari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();

    const year = date.getFullYear();

    const dateData = `${day} ${months[month]} ${year}`;
    const query = {
      text: 'INSERT INTO user_reward VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [id, userId, rewardId, dateData, desc],
    };
    console.log(query);

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menukarkan hadiah');
    }

    const stock = dataReward.rows[0].stock - 1;
    const update = {
      text: 'UPDATE rewards SET stock = $1 WHERE id = $2 RETURNING id',
      values: [stock, rewardId],
    };

    const updateStock = await this._pool.query(update);

    if (!updateStock.rows.length) {
      throw new InvariantError('Gagal mengupdate stock reward');
    }

    await this._usersService.updatePoint(userId, totalPoint);

    return result.rows[0].id;
  }

  async editReward(rewardId, {
    name, photo, desc, price, stock,
  }) {
    const query = {
      text: 'UPDATE rewards SET name = $1, photo = $2, desc_reward = $3, price = $4, stock = $5 WHERE id = $6 RETURNING id',
      values: [name, photo, desc, price, stock, rewardId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal mengupdate reward');
    }

    return result.rows[0].id;
  }

  async getAllRewardRequest() {
    const result = await this._pool.query(
      `SELECT user_reward.id, users.name, user_reward.date, rewards.name as "rewardName", rewards.photo, desc_redeem FROM user_reward 
      JOIN users 
      ON user_reward.user_id = users.id
      JOIN rewards
      ON user_reward.reward_id = rewards.id
      WHERE user_reward.status = 0`,
    );

    return result.rows;
  }

  async finishRequestReward(id) {
    const query = {
      text: 'UPDATE user_reward SET status = 1 WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menyelesaikan permintaan penukaran hadiah');
    }
  }

  async deleteReward(id) {
    const queryRequest = {
      text: 'SELECT * FROM user_reward WHERE reward_id = $1 AND status = 0',
      values: [id],
    };

    const resultRequest = await this._pool.query(queryRequest);

    if (!resultRequest.rows.length) {
      const query = {
        text: 'DELETE FROM rewards WHERE id = $1 RETURNING id',
        values: [id],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new InvariantError('Terjadi kesalahan saat menghapus hadiah. Silahkan mencoba kembali');
      }
    } else {
      throw new InvariantError('Gagal menghapus. Terdapat permintaan hadiah yang belum diselesaikan');
    }
  }
}

module.exports = RewardsService;
