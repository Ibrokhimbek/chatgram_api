import { sendCode, verifyCode } from "../controllers/auth.controller";

import { Router } from "express";

const router = Router();

router.post("/verifyEmail", sendCode);
router.post("/verifyCode", verifyCode);

export default router;
