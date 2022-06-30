/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('chat', {
    chat_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    sender_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    receiver_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    item_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    ishasmessage: {
      type: 'INT DEFAULT 0',
    },
    updated: {
      type: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()',
      notNull: true,
    },
  });
  pgm.addConstraint('chat', 'fk_chat.sender_id_users.id', 'FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('chat', 'fk_chat.receiver_id_users.id', 'FOREIGN KEY(receiver_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('chat', 'fk_chat.item_id_items.id', 'FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('chat', 'fk_chat.sender_id_users.id');
  pgm.dropConstraint('chat', 'fk_chat.receiver_id_users.id');
  pgm.dropConstraint('chat', 'fk_chat.item_id_items.id');
  pgm.dropTable('chat');
};
