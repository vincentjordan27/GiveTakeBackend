/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('request', {
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
    reason: {
      type: 'TEXT',
      notNull: true,
    },
    status: {
      //  -1 = No request 0 = waiting, 1 accepted, 2 rejected, 3 done, 4 owner
      type: 'INT DEFAULT 0',
      notNull: true,
    },
  });

  pgm.addConstraint('request', 'fk_request.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('request', 'fk_request.item_id_items.id', 'FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('request', 'fk_request.user_id_users.id');
  pgm.dropConstraint('request', 'fk_request.item_id_items.id');
  pgm.dropTable('request');
};
