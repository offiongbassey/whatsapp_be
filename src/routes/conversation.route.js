import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createGroup, create_open_conversation, getConversations } from "../controllers/conversation.controller.js";
import { validationHandler } from "../helpers/validation.js";
import { create_group_validator, create_open_conversation_validator } from "../middlewares/validator.js";

const router = express.Router();

router.post("/", validationHandler(create_open_conversation_validator), authMiddleware, create_open_conversation);
router.get("/", authMiddleware, getConversations)
router.post("/group", validationHandler(create_group_validator), authMiddleware, createGroup);

export default router;