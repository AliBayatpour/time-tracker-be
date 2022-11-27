import { IUser } from "../interfaces/user.interface";
import pool from "../pool";

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
    return result;
  }

  static async insert(createdUser: IUser) {
    let result;
    try {
      const { rows } = await pool.query(
        `
        INSERT INTO users (name, email, password) VALUES ($1, $2, $3)  RETURNING *;
      `,
        [createdUser.name, createdUser.email, createdUser.password]
      );
      result = rows;
    } catch (err) {
      console.log(err);
    }
    return result;
  }
}

export default UserRepo;
