import { NextFunction, Request, RequestHandler, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import { IGetUserAuthInfoRequest } from "../interfaces/get-user-id-req.interface";
import HttpError from "../models/http-error";

const JWT_KEY =
  "JLT&k2uu-J2y$dXbnC%PLkzuwQ8QSE689*DJ5oldc&8wdCQIsWczk6#A4Nnlmerg3LLdL8vvCD!2j&FoKF1#!pZmyKbBfqE*V5^wl7AeqW4KXG!jAbJ9ojksPp2mZRTk";

const checkAuth = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      const error = new HttpError("Authentication failed!", 403);
      return next(error);
    }
    const decodedToken: string | JwtPayload = jwt.verify(
      token,
      JWT_KEY as string
    );
    if (decodedToken.sub) {
      req.userId = decodedToken.sub as string;
    }
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};
export default checkAuth;
