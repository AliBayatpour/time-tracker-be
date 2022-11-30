import { IItem } from "../interfaces/item.interface";
import pool from "../pool";

class ItemRepo {
  static getItemsByUserId = async (user_id: string) => {
    let result;
    try {
      let todayTimeMidnight = new Date().setHours(0, 0, 0, 0);
      const { rows } = await pool.query(
        `
              SELECT * FROM items WHERE user_id = $1 AND done = $2 UNION SELECT * FROM items WHERE user_id = $3 AND done = $4 AND finished_at >= $5;
            `,
        [user_id, false, user_id, true, todayTimeMidnight]
      );
      result = rows;
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  static getLastNDaysItems = async (user_id: string, nDays: number) => {
    let result;
    try {
      const todayTimeMidnight = new Date().setHours(0, 0, 0, 0);
      const nDaysAgoTime = todayTimeMidnight - 3600000 * 24 * nDays;
      const { rows } = await pool.query(
        `
        SELECT * FROM items WHERE user_id = $1 AND done = $2 AND finished_at >= $3 ORDER BY finished_at ASC;
            `,
        [user_id, true, nDaysAgoTime]
      );
      result = rows;
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  static createItem = async (item: IItem, user_id: string) => {
    let result;
    try {
      const { rows } = await pool.query(
        `
              INSERT INTO items (user_id, category, description, done, finished_at, goal, progress, sort) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
            `,
        [
          user_id,
          item.category,
          item.description,
          item.done,
          item.finished_at,
          item.goal,
          item.progress,
          item.sort,
        ]
      );
      result = rows;
    } catch (error) {
      console.log(error);
    }

    return result;
  };

  static updateItem = async (item: IItem, user_id: string) => {
    let result;
    try {
      const { rows } = await pool.query(
        `
              UPDATE items SET updated_at = CURRENT_TIMESTAMP, category = $1, description = $2, done = $3, finished_at = $4, goal = $5, progress = $6, sort = $7 WHERE user_id = $8 AND id = $9 RETURNING *;
            `,
        [
          item.category,
          item.description,
          item.done,
          item.finished_at,
          item.goal,
          item.progress,
          item.sort,
          user_id,
          item.id,
        ]
      );
      result = rows;
    } catch (error) {
      console.log(error);
    }
    return result;
  };

  static deleteItem = async (id: string, user_id: string) => {
    let result;
    try {
      const { rows } = await pool.query(
        `
              DELETE FROM items WHERE id = $1 AND user_id = $2 RETURNING *;
            `,
        [id, user_id]
      );
      result = rows;
    } catch (error) {
      console.log(error);
    }
    return result;
  };
}

export default ItemRepo;
