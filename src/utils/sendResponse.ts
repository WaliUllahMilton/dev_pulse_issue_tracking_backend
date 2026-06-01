import type { Response } from "express";

const sendResponse = (
  res: Response,
  statsusCode: number,
  success: boolean = false,
  msg: string,
  data: any = null,
) => {
  return res.status(statsusCode).json({
    success: success,
    message: msg,
    data: data,
  });
};

export default sendResponse;
