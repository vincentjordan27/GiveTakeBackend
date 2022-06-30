/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('rewards', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    photo: {
      type: 'TEXT',
      notNull: true,
    },
    desc_reward: {
      type: 'TEXT',
      notNull: true,
    },
    price: {
      type: 'INTEGER',
      notNull: true,
    },
    stock: {
      type: 'INTEGER',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('rewards');
};
