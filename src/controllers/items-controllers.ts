import { NextFunction, RequestHandler, Response } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import { v4 as uuidv4 } from "uuid";
import { IItem } from "../interfaces/item.interface";
import { IGetUserAuthInfoRequest } from "../interfaces/get-user-id-req.interface";
import ItemRepo from "../repos/item-repo";

export const getItemById: RequestHandler = async (req, res, next) => {
  const itemId = req.params.id;

  let item;
  // * GET ITEM BY ID

  // * * * * * * * * * * * * * GET ITEM BY ID
  if (!item) {
    return next(
      new HttpError("Could not find a item for the provided id", 404)
    );
  }
  res.json({ item });
};

export const getItemsByUserId: RequestHandler = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  let items = [];
  // * GET ITEMS BY USER_ID
  if (req.userId) {
    items = await ItemRepo.getItemByUserId(req.userId);
  } else {
    return next(
      new HttpError("Could not find items for the provided user id", 404)
    );
  }

  // * * * * * * * * * * * * * GET ITEMS BY USER_ID
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
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { body } = req.body;
  let item: IItem = {
    id: uuidv4(),
    user_id: !!req.userId ? req.userId : "",
    body,
  };
  // * CREATE ITEM
  item = (await ItemRepo.createItem(item))[0];
  // * * * * * * * * * * * * * CREATE ITEM
  res.json({ item });
};

export const updateItem = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { id, body } = req.body;

  let item: IItem = {
    id: id,
    user_id: !!req.userId ? req.userId : "",
    body,
  };

  // * UPDATE ITEM
  item = (await ItemRepo.updateItem(item))[0];
  // * * * * * * * * * * * * * UPDATE ITEM
  res.json({ item });
};

export const deleteItem = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { id, body } = req.body;

  const item: IItem = {
    id: id,
    user_id: !!req.userId ? req.userId : "",
    body,
  };
  // * DELETE ITEM
  await ItemRepo.deleteItem(item);

  // * * * * * * * * * * * * * DELETE ITEM
  res.status(200).json({ message: "Deleted item." });
};
