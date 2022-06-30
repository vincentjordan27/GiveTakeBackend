/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql("INSERT INTO admin(id, username, password, email) VALUES('admin', 'admin', '13042001', 'vincentiustampubolon2@gmail.com')");
};

exports.down = (pgm) => {
  pgm.sql('DELETE FROM admin WHERE id = admin');
};
