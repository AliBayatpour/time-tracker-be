import { IUser } from "../interfaces/user.interface";
import pool from "../pool";
import { rowsParser } from "./utils/to-camel-case";

class UserRepo {
  static async findByEmail(email: string) {
    let result;
    try {
      const { rows } = await pool.query(
        `
      SELECT * FROM users WHERE email = $1;
    `,
        [email]
      );
      result = rows;
    } catch (err) {
      console.log(err);
    }
    return rowsParser(result);
  }

  static async insert(createdUser: IUser) {
    let result;
    try {
      const { rows } = await pool.query(
        `
        INSERT INTO users (name, email, password, timezone) VALUES ($1, $2, $3, $4)  RETURNING *;
      `,
        [
          createdUser.name,
          createdUser.email,
          createdUser.password,
          createdUser.timezone,
        ]
      );
      result = rows;
    } catch (err) {
      console.log(err);
    }
    return rowsParser(result);
  }
}

export default UserRepo;
