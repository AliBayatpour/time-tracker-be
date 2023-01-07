import moment, { Moment } from "moment";
import { ICategorizedItem } from "../../interfaces/categorized-item.interface";
import { ICategory } from "../../interfaces/category.interface";
import { IItem } from "../../interfaces/item.interface";

export const colorList = [
  "#E6C229",
  "#D11149",
  "#F17105",
  "#59D102",
  "#FF00CC",
  "#463DE3",
  "#961A7D",
  "#46E327",
  "#201A96",
  "#961A3E",
  "#E33DC2",
  "#1A9689",
  "#E6B1E2",
  "#E3BD27",
  "#418499",
  "#27B7E3",
];

export const randomColorGenerator = (): string => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const dailyKeyGenerator = (dateTime: Moment | number | Date) =>
  `${moment(dateTime).year()}-${moment(dateTime).month() + 1}-${moment(
    dateTime
  ).date()}`;

// daily group
const groupDaily = (list: IItem[], limit: number) => {
  const initial: { [key: string]: IItem[] } = {};
  for (let index = 1; index <= limit; index++) {
    const day = dailyKeyGenerator(moment().subtract(index, "days"));
    initial[day] = [];
  }
  const categories: ICategory = {};
  let total = 0;

  const stat = list.reduce((acc: { [key: string]: IItem[] }, item, index) => {
    const groupKey = dailyKeyGenerator(+item.finishedAt);
    if (!categories[item.category]) {
      categories[item.category] = {
        total: item.progress,
        color:
          index > colorList.length - 1
            ? randomColorGenerator()
            : colorList[index],
      };
    } else {
      categories[item.category] = {
        ...categories[item.category],
        total: categories[item.category].total + item.progress,
      };
    }

    total = total + item.progress;
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, initial);
  return { stat, categories, total };
};

const monthlyKeyGenerator = (dateTime: Moment | number | Date) =>
  `${moment(dateTime).year()}-${moment(dateTime).month() + 1}`;

// monthly group
const groupMonthly = (list: IItem[], limit: number) => {
  const initial: { [key: string]: IItem[] } = {};
  for (let index = 0; index < limit; index++) {
    const month = monthlyKeyGenerator(moment().subtract(index, "months"));
    initial[month] = [];
  }
  const categories: ICategory = {};
  let total = 0;

  const stat = list.reduce((acc: { [key: string]: IItem[] }, item, index) => {
    const groupKey = monthlyKeyGenerator(+item.finishedAt);
    if (!categories[item.category]) {
      categories[item.category] = {
        total: item.progress,
        color:
          index > colorList.length - 1
            ? randomColorGenerator()
            : colorList[index],
      };
    } else {
      categories[item.category] = {
        ...categories[item.category],
        total: categories[item.category].total + item.progress,
      };
    }

    total = total + item.progress;
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, initial);
  return { stat, categories, total };
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
  categoryKey: "month" | "day",
  limit: number
) => {
  const groupedData =
    categoryKey === "day"
      ? groupDaily(listOfItems, limit)
      : groupMonthly(listOfItems, limit);
  const categorizedGroup: ICategorizedItem = {};
  Object.entries(groupedData.stat).forEach((groupArr) => {
    categorizedGroup[groupArr[0]] = categorizeGroups(groupArr[1]);
  });
  return {
    stat: Object.entries(categorizedGroup).reverse(),
    categories: groupedData.categories,
    total: groupedData.total,
  };
};
