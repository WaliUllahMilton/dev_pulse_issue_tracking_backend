import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", authController.createUserController);
router.post("/login", authController.loginUserController);
export const authRouter = router;
