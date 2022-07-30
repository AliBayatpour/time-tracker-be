import pg from "pg";

class Pool {
  _pool: any = null;
  connect(options: any) {
    this._pool = new pg.Pool(options);
    return this._pool.query("SELECT 1 + 1");
  }

  close() {
    this._pool.end();
  }

  query(...args: any) {
    return this._pool.query(...args);
  }
}

export default new Pool();
