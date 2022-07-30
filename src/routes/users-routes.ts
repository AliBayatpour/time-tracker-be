import { Router } from "express";
import { check } from "express-validator";
import { login, signup } from "../controllers/users-controllers";

const router = Router();
router.post(
  "/signup",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  login
);

export default router;
