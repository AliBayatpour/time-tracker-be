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
    items = await ItemRepo.getItemByUserId(req.userId);
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
    user_id: !!req.userId ? req.userId : "",
    category,
    description,
    finished_at: 0,
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

  const { id, category, description, finished_at, sort, done, goal, progress } =
    req.body;

  let item: IItem = {
    id: id,
    user_id: !!req.userId ? req.userId : "",
    category,
    description,
    finished_at,
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
