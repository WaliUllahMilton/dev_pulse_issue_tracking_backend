import type { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `method : ${req.method}, url : ${req.url}, \ntoken : ${req.headers.authorization}\nbody : ${req.body}`,
  );
  next();
};
