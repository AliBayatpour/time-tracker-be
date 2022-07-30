import { IItem } from "../interfaces/item.interface";
import pool from "../pool";
import { rowsParser } from "./utils/to-camel-case";

class ItemRepo {
  static getItemByUserId = async (id: string) => {
    let result;
    try {
      const { rows } = await pool.query(
        `
              SELECT * FROM items WHERE user_id = $1;
            `,
        [id]
      );
      result = rows;
    } catch (err) {
      console.log(err);
    }
    return rowsParser(result);
  };
  static createItem = async (item: IItem) => {
    let result;
    try {
      const { rows } = await pool.query(
        `
              INSERT INTO items (user_id, body) VALUES ($1, $2) RETURNING *;
            `,
        [item.user_id, item.body]
      );
      result = rows;
    } catch (error) {
      console.log(error);
    }

    return rowsParser(result);
  };

  static updateItem = async (item: IItem) => {
    let result;
    try {
      const { rows } = await pool.query(
        `
              UPDATE items SET body = $1 WHERE user_id = $2 AND id = $3  RETURNING *;
            `,
        [item.body, item.user_id, item.id]
      );
      result = rows;
    } catch (error) {
      console.log(error);
    }
    return rowsParser(result);
  };

  static deleteItem = async (item: IItem) => {
    let result;
    try {
      const { rows } = await pool.query(
        `
              DELETE FROM items WHERE id = $1 AND user_id = $2   RETURNING *;
            `,
        [item.id, item.user_id]
      );
      result = rows;
    } catch (error) {
      console.log(error);
    }
    return rowsParser(result);
  };
}

export default ItemRepo;
