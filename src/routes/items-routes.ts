import { Router } from "express";
import {
  createItem,
  deleteItem,
  getItemById,
  getItemsByUserId,
  updateItem,
} from "../controllers/items-controllers";
import checkAuth from "../middlewares/check-auth";

const router = Router();

router.use(checkAuth);

router.get("/:itemid", getItemById);
router.get("/", getItemsByUserId);
router.post("/", [], createItem);
router.put("/", [], updateItem);
router.delete("/", deleteItem);

export default router;
