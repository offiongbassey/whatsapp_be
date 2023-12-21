import express from "express";
import trimRequest from "trim-request";
import authMiddelware from "../middlewares/authMiddleware.js";
import { searchUsers } from "../controllers/user.controller.js";
const router = express.Router();

router.route("/").get(trimRequest.all, authMiddelware, searchUsers);

export default router;