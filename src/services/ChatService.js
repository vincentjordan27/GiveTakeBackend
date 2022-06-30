const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class ChatService {
  constructor() {
    this._pool = new Pool();
  }

  async createChat(senderId, { receiverId, itemsId }) {
    const queryCheck = {
      text: 'SELECT chat_id FROM chat WHERE sender_id = $1 AND receiver_id = $2 AND item_id = $3',
      values: [senderId, receiverId, itemsId],
    };

    const checkChat = await this._pool.query(queryCheck);

    if (!checkChat.rows.length) {
      const id = `chat-${nanoid(16)}`;

      const query = {
        text: 'INSERT INTO chat VALUES ($1, $2, $3, $4, $5) RETURNING chat_id',
        values: [id, senderId, receiverId, itemsId, 0],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new InvariantError('Gagal membuat obrolan');
      }

      return result.rows[0].chat_id;
    }

    return checkChat.rows[0].chat_id;
  }

  async deleteChat(id) {
    const query = {
      text: 'DELETE FROM chat WHERE chat_id = $1 RETURNING chat_id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus obrolan');
    }
  }

  async updateValidChat(chatId) {
    const query = {
      text: 'UPDATE chat SET ishasmessage = 1, updated = NOW() WHERE chat_id = $1 RETURNING chat_id',
      values: [chatId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal memperbarui obrolan');
    }
  }

  async getChatList(userId) {
    const query = {
      text: `SELECT chat.*, sender.name as sender_name, sender.token as sender_token, receiver.name as receiver_name, receiver.token as receiver_token, items.name FROM chat
      JOIN items
      ON chat.item_id = items.id
      JOIN users sender
      ON chat.sender_id = sender.id
      JOIN users receiver
      ON chat.receiver_id = receiver.id
      WHERE chat.sender_id = $1 OR chat.receiver_id = $2
      ORDER BY chat.updated DESC`,
      values: [userId, userId],
    };

    const result = await this._pool.query(query);

    return result.rows.filter((data) => data.ishasmessage === 1);
  }

  async verifyChatId(id) {
    const query = {
      text: 'SELECT * FROM chat WHERE chat_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Obrolan tidak ditemukan');
    }
  }
}

module.exports = ChatService;
