import moment from "moment-timezone";
import { IItem } from "../interfaces/item.interface";
import { TimezoneItem } from "../interfaces/timezone-item.interface";
import pool from "../pool";
import { rowsParser } from "./utils/to-camel-case";

class ItemRepo {
  static getItemsByUserId = async (userId: string) => {
    let result;
    try {
      const timezone = await this.getUserTimezone(userId);
      let todayTimeMidnight = moment.tz(timezone).startOf("day").valueOf();
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

  static getAllDoneItems = async () => {
    let result = [];
    try {
      const { rows } = await pool.query(
        `
              SELECT items.*, timezone FROM items JOIN users ON items.user_id = users.id WHERE done = $1;
            `,
        [true]
      );
      result = rows;
    } catch (err) {
      console.log(err);
    }
    return rowsParser(result) as TimezoneItem[];
  };

  static getLastNDaysItems = async (userId: string, nDays: number) => {
    let result;
    const timezone = await this.getUserTimezone(userId);
    let todayTimeMidnight = moment.tz(timezone).startOf("day").valueOf();
    const nDaysAgo =
      nDays <= 7
        ? 7
        : nDays <= 30
        ? 30
        : nDays <= 90
        ? 12 * 7
        : nDays <= 180
        ? 180
        : 360;
    try {
      const timezone = await this.getUserTimezone(userId);
      const nDaysAgoTime = moment
        .tz(timezone)
        .startOf("day")
        .subtract(nDaysAgo, "days")
        .valueOf();
      const { rows } = await pool.query(
        `
        SELECT * FROM done_items WHERE user_id = $1 AND done = $2 AND finished_at >= $3 AND finished_at < $4 ORDER BY finished_at ASC;
            `,
        [userId, true, nDaysAgoTime, todayTimeMidnight]
      );
      result = rows;
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

  static transferDoneItems = async () => {
    const doneItems = await this.getAllDoneItems();
    doneItems?.forEach(async (item) => {
      let todayTimeMidnight = moment.tz(item.timezone).startOf("day").valueOf();

      if (item.finishedAt > todayTimeMidnight) {
        return;
      }
      const client = await pool.newPool().connect();
      try {
        await client.query("BEGIN");
        await pool.query(
          `
              INSERT INTO done_items (id, user_id, created_at, updated_at, category, description, done, finished_at, goal, progress, sort) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
            `,
          [
            item.id,
            item.userId,
            item.createdAt,
            item.updatedAt,
            item.category,
            item.description,
            item.done,
            item.finishedAt,
            item.goal,
            item.progress,
            item.sort,
          ]
        );
        await pool.query(
          `
        DELETE FROM items WHERE id = $1;
        `,
          [item.id]
        );
        await client.query("COMMIT");
      } catch (error) {
        console.log(error);
        await client.query("ROLLBACK");
      } finally {
        client.release();
      }
    });
  };
  static getUserTimezone = async (userId: IItem["userId"]) => {
    const { rows } = await pool.query(
      `SELECT timezone FROM users WHERE id = $1`,
      [userId]
    );
    return rows[0]?.timezone;
  };
}

export default ItemRepo;
