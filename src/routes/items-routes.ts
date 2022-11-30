import { Router } from "express";
import { check } from "express-validator";
import {
  createItem,
  deleteItem,
  getItemsByUserId,
  getLastNDaysItems,
  updateItem,
} from "../controllers/items-controllers";
import checkAuth from "../middlewares/check-auth";

const router = Router();

router.use(checkAuth);

router.get("/", getItemsByUserId);
router.get("/last-n-days/:nday", getLastNDaysItems);
router.post(
  "/",
  [
    check("category").notEmpty(),
    check("description").notEmpty(),
    check("goal").notEmpty(),
    check("sort").notEmpty(),
  ],
  createItem
);
router.patch(
  "/",
  [
    check("category").notEmpty(),
    check("description").notEmpty(),
    check("goal").notEmpty(),
  ],
  updateItem
);
router.delete("/", deleteItem);

export default router;
