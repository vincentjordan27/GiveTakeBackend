/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('items', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    description: {
      type: 'TEXT',
      notNull: true,
    },
    category: {
      type: 'TEXT',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    latitude: {
      type: 'TEXT',
      notNull: true,
    },
    longitude: {
      type: 'TEXT',
      notNull: true,
    },
    max_radius: {
      type: 'INT',
      notNull: true,
    },
    status: {
      // 0 = free, 1 = penerima terpilih, 2 = selesa
      type: 'INT DEFAULT 0',
    },
    address: {
      type: 'TEXT',
    },
    ulasan: {
      type: 'TEXT',
    },
    thumbnail: {
      type: 'TEXT',
    },
    updated: {
      type: 'TIMESTAMPTZ NOT NULL DEFAULT NOW()',
      notNull: true,
    },
  });

  pgm.addConstraint('items', 'fk_items.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('items');
  pgm.dropConstraint('items', 'fk_items.user_id_users.id');
};
