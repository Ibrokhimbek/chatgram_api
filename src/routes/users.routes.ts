import { getUsers } from "../controllers/users.controller";

import { Router } from "express";

const router = Router();

router.get("/", getUsers);

export default router;
