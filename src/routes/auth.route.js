import express from "express";
import { getLoginStatus, login, logout, refreshToken, register } from "../controllers/auth.controller.js";
import { validationHandler } from "../helpers/validation.js";
import { get_login_status_validator, login_validator, signup_validator } from "../middlewares/validator.js";

const router = express.Router();

router.post("/register", validationHandler(signup_validator), register);
router.post("/login", validationHandler(login_validator), login);
router.post("/logout", logout);
router.post("/refreshtoken", refreshToken)
router.get("/logged-in-status/:token", validationHandler(get_login_status_validator), getLoginStatus);

export default router;