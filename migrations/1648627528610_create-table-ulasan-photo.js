/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('ulasan_photo', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    item_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    url: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint('ulasan_photo', 'fk_usalan_photo.item_id_items.id', 'FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('ulasan_photo', 'fk_usalan_photo.item_id_items.id');
  pgm.dropTable('ulasan_photo');
};
