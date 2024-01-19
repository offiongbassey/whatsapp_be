import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";
import { deleteMessage, editMessage, getMessages, handleReaction, replyMessage, sendMessage } from "../controllers/message.controller.js";
import { validationHandler } from "../helpers/validation.js";
import { delete_message_validator, edit_message_validator, get_messages_validator, handle_reaction_validator, reply_message_validator, send_message_validator } from "../middlewares/validator.js";

const router = express.Router();

router.post("/", validationHandler(send_message_validator), authMiddleware, sendMessage);
router.get("/:convo_id", validationHandler(get_messages_validator), authMiddleware, getMessages);
router.patch("/delete/:message_id", validationHandler(delete_message_validator), authMiddleware, deleteMessage);
router.put("/:message_id", validationHandler(edit_message_validator), authMiddleware, editMessage);
router.put("/reaction/:message_id", validationHandler(handle_reaction_validator), authMiddleware, handleReaction);
router.patch("/reply/:reply_id", validationHandler(reply_message_validator), authMiddleware, replyMessage);

export default router;