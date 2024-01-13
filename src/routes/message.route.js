import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";
import { deleteMessage, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.route('/').post(trimRequest.all, authMiddleware, sendMessage);
router.route('/:convo_id').get(trimRequest.all, authMiddleware, getMessages);
router.route('/delete/:message_id').patch(trimRequest.all, authMiddleware, deleteMessage);

export default router;