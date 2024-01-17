import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";
import { deleteMessage, editMessage, getMessages, handleReaction, replyMessage, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.route('/').post(trimRequest.all, authMiddleware, sendMessage);
router.route('/:convo_id').get(trimRequest.all, authMiddleware, getMessages);
router.route('/delete/:message_id').patch(trimRequest.all, authMiddleware, deleteMessage);
router.route('/:message_id').put(trimRequest.all, authMiddleware, editMessage);
router.route('/reaction/:message_id').put(trimRequest.all, authMiddleware, handleReaction);
router.route('/reply/:reply_id').patch(trimRequest.all, authMiddleware, replyMessage);

export default router;