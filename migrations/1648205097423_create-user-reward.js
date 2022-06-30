/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('user_reward', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    reward_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    desc_redeem: {
      type: 'TEXT',
      notNull: true,
    },
    status: {
      // 0 = diproses, 1 = selesai
      type: 'INT DEFAULT 0',
      notNull: true,
    },
  });

  pgm.addConstraint('user_reward', 'fk_user_reward.user_id_users_id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('user_reward', 'fk_user_reward.reward_id_rewards.id', 'FOREIGN KEY(reward_id) REFERENCES rewards(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('user_reward', 'fk_user_reward.user_id_users_id');
  pgm.dropConstraint('user_reward', 'fk_user_reward.reward_id_rewards.id');

  pgm.dropTable('user_reward');
};
