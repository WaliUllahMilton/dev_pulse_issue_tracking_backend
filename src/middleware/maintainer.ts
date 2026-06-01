import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { jwtVerify, sendErrorResponse, sendResponse } from "../utils";

const isMaintainer = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    const decodeToken = jwtVerify(
      authorization as string,
      config.jwtSecret as string,
    ) as JwtPayload;

    if (!authorization) {
      sendResponse(res, 400, false, "token required");
    }
    if (!decodeToken) {
      sendResponse(res, 401, false, "Unauthorized access!");
    }
    if (decodeToken.data.role === "maintainer") {
      req.user = decodeToken;
      next();
    } else {
      sendResponse(res, 403, false, "Forbidden");
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export default isMaintainer;
