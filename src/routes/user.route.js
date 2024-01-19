import express from "express";
import trimRequest from "trim-request";
import authMiddelware from "../middlewares/authMiddleware.js";
import { searchUsers } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/", authMiddelware, searchUsers);

export default router;