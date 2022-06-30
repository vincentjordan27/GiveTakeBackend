/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('advice_photo', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    url: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    advice_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'advice_photo',
    'fk_advice_photo.advice_id_advice.id',
    'FOREIGN KEY(advice_id) REFERENCES advice(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('advice_photo', 'fk_advice_photo.advice_id_advice.id');
  pgm.dropTable('advice_photo');
};
