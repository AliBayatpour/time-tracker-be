/* eslint-disable @typescript-eslint/naming-convention */

exports.shorthands = undefined;

exports.up = async (pgm) => {
  await pgm.sql(`
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  password TEXT NOT NULL,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  PRIMARY KEY(id)
  );
  `);
};

exports.down = async (pgm) => {
  await pgm.sql(`
    DROP TABLE users;
    `);
};
