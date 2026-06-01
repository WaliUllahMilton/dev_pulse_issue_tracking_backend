import type { Response } from "express";

const sendErrorResponse = (res: Response, error: any) => {
  return res
    .status(500)
    .json({ success: false, message: error.message, error });
};

export default sendErrorResponse;
