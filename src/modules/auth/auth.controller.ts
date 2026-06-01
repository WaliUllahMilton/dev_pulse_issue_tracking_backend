import type { Request, Response } from "express";
import { sendErrorResponse, sendResponse } from "../../utils";
import { authService } from "./auth.service";

const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const isAlreadyRegistered = await authService.findUserByEmail(email);
    if (isAlreadyRegistered && isAlreadyRegistered.rowCount) {
      sendResponse(res, 409, false, "User already exist!");
    } else {
      const createUser = await authService.createUserInDB(
        name,
        email,
        password,
        role,
      );
      sendResponse(
        res,
        201,
        true,
        "User registered successfully",
        createUser.rows[0],
      );
    }
  } catch (error: any) {
    sendErrorResponse(res, error);
  }
};

const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const isExistingUser = await authService.findUserByEmail(email);
    if (isExistingUser?.rowCount) {
      const user = await authService.loginUserByEmailAndPass(email, password);
      sendResponse(res, 200, true, "Login successful", {
        token: user?.token,
        user: user?.rows[0],
      });
    } else {
      sendResponse(
        res,
        400,
        false,
        "No user register with this email please register first!",
      );
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const authController = {
  createUserController,
  loginUserController,
};
