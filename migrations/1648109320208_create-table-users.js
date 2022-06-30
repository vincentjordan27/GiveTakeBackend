/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    username: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    point: {
      type: 'INT',
      notNull: true,
    },
    email: {
      type: 'TEXT',
      notNull: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    phone: {
      type: 'VARCHAR(15)',
      notNull: true,
    },
    longitude: {
      type: 'TEXT',
    },
    latitude: {
      type: 'TEXT',
    },
    address: {
      type: 'TEXT',
    },
    photo: {
      type: 'TEXT',
    },
    token: {
      type: 'TEXT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
