import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { IUser } from "../interfaces/user.interface";
import bcrypt from "bcryptjs";
import HttpError from "../models/http-error";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import UserRepo from "../repos/user-repo";

const JWT_KEY =
  "JLT&k2uu-J2y$dXbnC%PLkzuwQ8QSE689*DJ5oldc&8wdCQIsWczk6#A4Nnlmerg3LLdL8vvCD!2j&FoKF1#!pZmyKbBfqE*V5^wl7AeqW4KXG!jAbJ9ojksPp2mZRTk";

const expiresInHour = 10000;
const expiresInHourStr = expiresInHour + "h";
const expiresInMili = expiresInHour * 60 * 60 * 1000;

export const signup: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser: IUser | null = null;
  // * CHECK IF USER EXISTS
  existingUser = (await UserRepo.findByEmail(email))[0];
  // * * * * * * * * * * * * * CHECK IF USER EXISTS
  if (existingUser) {
    const error = new HttpError("This user already exists", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("could not create user please try again", 500);
    return next(error);
  }
  let createdUser: IUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
  };

  if (email && password && name) {
    createdUser = (await UserRepo.insert(createdUser))[0];
  } else {
    const error = new HttpError("user info missing", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { sub: createdUser.id, email: createdUser.email },
      JWT_KEY,
      { expiresIn: expiresInHourStr }
    );
  } catch (err) {
    const error = new HttpError("Sign up failed please try again later", 500);
    return next(error);
  }

  res.status(201).json({
    sub: createdUser.id,
    access_token: token,
    exp: expiresInMili + new Date().getTime(),
  });
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser: IUser | null = null;

  const queryRes = await UserRepo.findByEmail(email);
  existingUser = queryRes?.length && queryRes[0];
  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in",
      403
    );
    return next(error);
  }

  let isValidPassword = false;

  try {
    if (existingUser?.password) {
      isValidPassword = await bcrypt.compare(password, existingUser?.password);
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try agian.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { sub: existingUser.id, email: existingUser.email },
      JWT_KEY,
      { expiresIn: expiresInHourStr }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("login failed please try again later", 500);
    return next(error);
  }

  res.status(201).json({
    sub: existingUser.id,
    access_token: token,
    exp: expiresInMili + new Date().getTime(),
  });
};
