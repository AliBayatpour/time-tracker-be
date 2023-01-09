import pg from "pg";
import keys from "./keys";

const dbOptions = {
  host: keys.pgHost,
  port: keys.pgPort ? +keys.pgPort : 4100,
  database: keys.pgDb,
  user: keys.pgUser,
  password: keys.pgPass,
};
class Pool {
  _pool: any = null;
  connect() {
    this._pool = new pg.Pool(dbOptions);
    return this._pool.query("SELECT 1 + 1");
  }
  newPool() {
    return new pg.Pool(dbOptions);
  }

  close() {
    this._pool.end();
  }

  query(...args: any) {
    return this._pool.query(...args);
  }
}

export default new Pool();
