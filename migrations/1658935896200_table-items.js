/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = async (pgm) => {
  await pgm.sql(`
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE items (
  id uuid DEFAULT uuid_generate_v4(),
  user_id uuid DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  body TEXT NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT fk_users
  FOREIGN KEY(user_id) 
  REFERENCES users(id)
  ON DELETE CASCADE
  );
  `);

};

exports.down = async (pgm) => {
  await pgm.sql(`
  DROP TABLE items;
  `);
};
