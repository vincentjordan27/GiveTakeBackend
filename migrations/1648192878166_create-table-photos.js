/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('item_photos', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    url: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    item_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('item_photos');
};
