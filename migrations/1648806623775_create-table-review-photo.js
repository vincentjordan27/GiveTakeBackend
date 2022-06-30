/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('review_photo', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    url: {
      type: 'TEXT',
      notNull: true,
    },
    review_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('review_photo', 'fk_review_photo.review_id_review.id', 'FOREIGN KEY(review_id) REFERENCES review(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('review_photo', 'fk_review_photo.review_id_review.id');
  pgm.dropTable('review_photo');
};
