/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('advice', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    category: {
      type: 'TEXT',
      notNull: true,
    },
    description: {
      type: 'TEXT',
      notNull: true,
    },
    reply: {
      type: 'TEXT',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    addDate: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint('advice', 'fk_advice.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('advice', 'fk_advice.user_id_users.id');
  pgm.dropTable('advice');
};
