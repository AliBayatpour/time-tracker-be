import { IUser } from "../interfaces/user.interface";
import pool from "../pool";
import { rowsParser } from "./utils/to-camel-case";

class UserRepo {
  static async findByEmail(email: string) {
    const { rows } = await pool.query(
      `
      SELECT * FROM users WHERE email = $1;
    `,
      [email]
    );
    return rowsParser(rows);
  }

  static async insert(createdUser: IUser) {
    const { rows } = await pool.query(
      `
        INSERT INTO users (email, password) VALUES ($1, $2)  RETURNING *;
      `,
      [createdUser.email, createdUser.password]
    );
    return rowsParser(rows);
  }
}

export default UserRepo;
