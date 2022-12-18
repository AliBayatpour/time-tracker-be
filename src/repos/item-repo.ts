import { IItem } from "../interfaces/item.interface";
import pool from "../pool";
import { groupCategorizeList } from "./utils/categorize-items";
import { rowsParser } from "./utils/to-camel-case";

class ItemRepo {
  static getItemsByUserId = async (userId: string) => {
    let result;
    try {
      let todayTimeMidnight = new Date().setHours(0, 0, 0, 0);

      const { rows } = await pool.query(
        `
              SELECT * FROM items WHERE user_id = $1 AND done = $2 UNION SELECT * FROM items WHERE user_id = $3 AND done = $4 AND finished_at >= $5;
            `,
        [userId, false, userId, true, todayTimeMidnight]
      );
      result = rows;
    } catch (err) {
      console.log(err);
    }
    return rowsParser(result);
  };

  static getLastNDaysItems = async (userId: string, nDays: number) => {
    let result;
    try {
      const todayTimeMidnight = new Date().setHours(0, 0, 0, 0);
      const nDaysAgoTime = todayTimeMidnight - 3600000 * 24 * nDays;
      const { rows } = await pool.query(
        `
        SELECT * FROM items WHERE user_id = $1 AND done = $2 AND finished_at >= $3 ORDER BY finished_at ASC;
            `,
        [userId, true, nDaysAgoTime]
      );

      result =
        nDays <= 7
          ? (rowsParser(rows) as IItem[])
          : nDays <= 30
          ? groupCategorizeList(rowsParser(rows), "week")
          : groupCategorizeList(rowsParser(rows), "month");
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  static createItem = async (item: IItem, userId: string) => {
    let result;
    try {
      const { rows } = await pool.query(
        `
              INSERT INTO items (user_id, category, description, done, finished_at, goal, progress, sort) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
            `,
        [
          userId,
          item.category,
          item.description,
          item.done,
          item.finishedAt,
          item.goal,
          item.progress,
          item.sort,
        ]
      );
      result = rows;
    } catch (error) {
      console.log(error);
    }

    return rowsParser(result);
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
          item.finishedAt,
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
    return rowsParser(result);
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
    return rowsParser(result);
  };
}

export default ItemRepo;
