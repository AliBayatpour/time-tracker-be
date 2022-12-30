import ItemRepo from "../repos/item-repo";
import { groupCategorizeList } from "../repos/utils/categorize-items";
import { rowsParser } from "../repos/utils/to-camel-case";

class ItemService {
  static getLastNDaysItems = async (userId: string, nDays: number) => {
    const rows = await ItemRepo.getLastNDaysItems(userId, nDays);

    let result =
      nDays <= 7
        ? groupCategorizeList(rowsParser(rows), "day", 7)
        : nDays <= 30
        ? groupCategorizeList(rowsParser(rows), "day", 30)
        : nDays <= 90
        ? groupCategorizeList(rowsParser(rows), "day", 90)
        : nDays <= 180
        ? groupCategorizeList(rowsParser(rows), "month", 6)
        : groupCategorizeList(rowsParser(rows), "month", 12);

    return result;
  };
}

export default ItemService;
