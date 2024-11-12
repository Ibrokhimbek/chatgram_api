import { getUsers } from "../controllers/users.controller";

import { Router } from "express";
import { errorHandler } from "../utils/errorHandler";
import auth from "../middlewares/auth.middleware";

const router = Router();

router.get("/", auth, errorHandler(getUsers));

export default router;
