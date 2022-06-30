/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('review', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    review: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('review');
};
