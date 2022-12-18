import moment from "moment";
import { ICategorizedItem } from "../../interfaces/categorized-item.interface";
import { IItem } from "../../interfaces/item.interface";

// weekly group
const groupWeekly = (list: IItem[]) => {
  return list.reduce((acc: { [key: string]: IItem[] }, date) => {
    const yearWeek = `${moment(+date?.finishedAt).year()}-${moment(
      +date?.finishedAt
    ).week()}`;
    if (!acc[yearWeek]) {
      acc[yearWeek] = [];
    }
    acc[yearWeek].push(date);
    return acc;
  }, {});
};

// monthly group
const groupMonthly = (list: IItem[]) => {
  return list.reduce((acc: { [key: string]: IItem[] }, item) => {
    const yearWeek = `${moment(+item?.finishedAt).year()}-${
      moment(+item?.finishedAt).month() + 1
    }`;

    if (!acc[yearWeek]) {
      acc[yearWeek] = [];
    }
    acc[yearWeek].push(item);
    return acc;
  }, {});
};

const categorizeGroups = (arr: IItem[]) => {
  const resultObj: { [key: string]: number } = {};
  arr.forEach((item) => {
    let resultCategory = resultObj[item.category];
    if (!resultCategory) {
      resultObj[item.category] = item.progress;
    } else {
      resultObj[item.category] = resultCategory + item.progress;
    }
  });
  return resultObj;
};

export const groupCategorizeList = (
  listOfItems: IItem[],
  categoryKey: "week" | "month"
) => {
  const groupedList =
    categoryKey === "week"
      ? groupWeekly(listOfItems)
      : groupMonthly(listOfItems);
  const categorizedGroup: ICategorizedItem = {};
  Object.entries(groupedList).forEach((groupArr) => {
    categorizedGroup[groupArr[0]] = categorizeGroups(groupArr[1]);
  });
  return Object.entries(categorizedGroup);
};
