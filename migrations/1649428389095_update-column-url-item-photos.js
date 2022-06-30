/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropColumn('item_photos', 'url');
  pgm.addColumn('item_photos', {
    url: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('item_photos', 'url');
  pgm.addColumn('item_photos', {
    url: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
};
