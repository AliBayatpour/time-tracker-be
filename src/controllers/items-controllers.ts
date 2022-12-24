import { NextFunction, RequestHandler, Response } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import { v4 as uuidv4 } from "uuid";
import { IItem } from "../interfaces/item.interface";
import { IGetUserAuthInfoRequest } from "../interfaces/get-user-id-req.interface";
import ItemRepo from "../repos/item-repo";

export const getItemsByUserId: RequestHandler = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  let items = [];
  if (req.userId) {
    items = await ItemRepo.getItemsByUserId(req.userId);
  } else {
    return next(
      new HttpError("Could not find items for the provided user id", 404)
    );
  }

  if (!items) {
    return next(
      new HttpError("Could not find items for the provided user id", 404)
    );
  }
  res.json({ items });
};

export const getLastNDaysItems = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  let result:
    | IItem[]
    | { stat: [string, { [key: string]: number }][]; categories: string[] }
    | undefined;
  const nDaysAgo = +req.params.nday;
  if (
    req.userId &&
    typeof nDaysAgo === "number" &&
    nDaysAgo &&
    nDaysAgo < 380
  ) {
    result = await ItemRepo.getLastNDaysItems(req.userId, nDaysAgo);
  } else {
    return next(new HttpError("Invalid request", 400));
  }

  if (!result) {
    return next(
      new HttpError("Could not find items for the provided user id", 404)
    );
  }
  res.json(result);
};

export const createItem = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || !req.userId) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { category, description, sort, goal } = req.body;
  let item: IItem = {
    id: uuidv4(),
    userId: !!req.userId ? req.userId : "",
    category,
    description,
    finishedAt: 0,
    sort,
    done: false,
    goal,
    progress: 0,
  };
  item = (await ItemRepo.createItem(item, req.userId))[0];
  res.json({ item });
};

export const updateItem = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || !req.userId) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { id, category, description, finishedAt, sort, done, goal, progress } =
    req.body;

  let item: IItem = {
    id: id,
    userId: !!req.userId ? req.userId : "",
    category,
    description,
    finishedAt,
    sort,
    done,
    goal,
    progress,
  };
  item = (await ItemRepo.updateItem(item, req.userId))[0];
  res.json({ item });
};

export const deleteItem = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || !req.userId) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { id } = req.body;

  await ItemRepo.deleteItem(id, req.userId);

  res.status(200).json({ message: "Deleted item." });
};
