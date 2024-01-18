import express from "express";
import trimRequest from "trim-request";
import { getLoginStatus, login, logout, refreshToken, register } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.route("/register").post(trimRequest.all,register);
router.route("/login").post(trimRequest.all,login);
router.route("/logout").post(trimRequest.all,logout);
router.route("/refreshtoken").post(trimRequest.all,refreshToken);
router.route("/logged-in-status/:token").get(trimRequest.all, getLoginStatus);

export default router;