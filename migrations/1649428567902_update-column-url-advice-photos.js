/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropColumn('advice_photo', 'url');
  pgm.addColumn('advice_photo', {
    url: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('advice_photo', 'url');
  pgm.addColumn('advice_photo', {
    url: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
};
