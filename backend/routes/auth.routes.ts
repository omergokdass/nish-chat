import { Router } from "express";
import { loginUser, registerUser, verifyCode, resendCode } from "../controllers/auth.controller";


const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-code", verifyCode);
router.post("/resend-code", resendCode);

export default router;