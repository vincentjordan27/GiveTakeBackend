/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('wishlist', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    item_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('wishlist', 'fk_wishlist.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('wishlist', 'fk_wishlist.item_id_items.id', 'FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('wishlist', 'fk_wishlist.user_id_users.id');
  pgm.dropConstraint('wishlist', 'fk_wishlist.item_id_items.id');
  pgm.dropTable('wishlist');
};
