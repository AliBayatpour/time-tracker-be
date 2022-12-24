import moment, { Moment } from "moment";
import { ICategorizedItem } from "../../interfaces/categorized-item.interface";
import { IItem } from "../../interfaces/item.interface";

const dailyKeyGenerator = (dateTime: Moment | number | Date) =>
  `${moment(dateTime).year()}-${moment(dateTime).month() + 1}-${moment(
    dateTime
  ).date()}`;

// daily group
const groupDaily = (list: IItem[], limit: number) => {
  const initial: { [key: string]: IItem[] } = {};
  for (let index = 0; index < limit; index++) {
    const day = dailyKeyGenerator(moment().subtract(index, "days"));
    initial[day] = [];
  }
  const categories: string[] = [];
  const stat = list.reduce((acc: { [key: string]: IItem[] }, item) => {
    const groupKey = dailyKeyGenerator(+item.finishedAt);
    if (!categories.includes(item.category)) {
      categories.push(item.category);
    }
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, initial);
  return { stat, categories };
};

const weeklyKeyGenerator = (dateTime: Moment | number | Date) =>
  `${moment(dateTime).year()}-${moment(dateTime).week()}`;

// weekly group
const groupWeekly = (list: IItem[], limit: number) => {
  const initial: { [key: string]: IItem[] } = {};
  for (let index = 0; index < limit; index++) {
    const day = weeklyKeyGenerator(moment().subtract(index, "weeks"));
    initial[day] = [];
  }
  const categories: string[] = [];
  const stat = list.reduce((acc: { [key: string]: IItem[] }, item) => {
    const groupKey = weeklyKeyGenerator(+item.finishedAt);
    if (!categories.includes(item.category)) {
      categories.push(item.category);
    }
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, initial);
  return { stat, categories };
};

const monthlyKeyGenerator = (dateTime: Moment | number | Date) =>
  `${moment(dateTime).year()}-${moment(dateTime).month() + 1}`;

// monthly group
const groupMonthly = (list: IItem[], limit: number) => {
  const initial: { [key: string]: IItem[] } = {};
  for (let index = 0; index < limit; index++) {
    const day = monthlyKeyGenerator(moment().subtract(index, "months"));
    initial[day] = [];
  }
  const categories: string[] = [];
  const stat = list.reduce((acc: { [key: string]: IItem[] }, item) => {
    const groupKey = monthlyKeyGenerator(+item.finishedAt);
    if (!categories.includes(item.category)) {
      categories.push(item.category);
    }
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, initial);
  return { stat, categories };
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
  categoryKey: "week" | "month" | "day",
  limit: number
) => {
  const groupedData =
    categoryKey === "day"
      ? groupDaily(listOfItems, limit)
      : categoryKey === "week"
      ? groupWeekly(listOfItems, limit)
      : groupMonthly(listOfItems, limit);
  const categorizedGroup: ICategorizedItem = {};
  Object.entries(groupedData.stat).forEach((groupArr) => {
    categorizedGroup[groupArr[0]] = categorizeGroups(groupArr[1]);
  });
  return {
    stat: Object.entries(categorizedGroup).reverse(),
    categories: groupedData.categories,
  };
};
