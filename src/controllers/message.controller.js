import { updateLatestMessage } from "../services/conversation.service.js";
import { createMessage, deleteUserMessage, editUserMessage, getConvoMessages, populateMessage, sendReaction } from "../services/message.service.js";

export const sendMessage = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const { message, convo_id, files } = req.body;
        if(!convo_id){
            logger.error("Please provide a conversaion Id and a message body.");
            return res.status(400);
        }
        const msgData = {
            sender: user_id,
            message,
            conversation: convo_id,
            files:  files || [],
        };
        let newMessage = await createMessage(msgData);
        let populatedMessage = await populateMessage(newMessage._id);
        await updateLatestMessage(convo_id, newMessage);
        res.json(populatedMessage);

    } catch (error) {
        next(error);
    }
}

export const  getMessages = async (req, res, next) => {
    try {
        const convo_id = req.params.convo_id;
        if(!convo_id) {
            logger.error("Please add a conversation ID in params");
            res.status(400);
        }
        const messages = await getConvoMessages(convo_id);
        res.json(messages);
    } catch (error) {
        next(error);
    }
}

export const deleteMessage = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const { message_id } = req.params;
        if(!message_id){
            logger.error("Message Id is required");
            res.status(400);
        }

        const delete_message = await deleteUserMessage(message_id, user_id);
        const populated_message = await populateMessage(delete_message._id);
        res.json(populated_message)
    } catch (error) {
        next(error);
    }
}

export const editMessage = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const { message_id } = req.params;
        const { message } = req.body;

        if(!message_id){
            logger.error("Message Id is required");
            res.status(400);
        }

        const edit_message = await editUserMessage(message_id, user_id, message);
        const populated_message = await populateMessage(edit_message._id);
        console.log("Message editing...", populated_message);
        res.json(populated_message);

    } catch (error) {
        next(error);
    }
}

export const handleReaction = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const { message_id } = req.params;
        const { emoji } = req.body;

        if(!message_id){
            logger.error("Message ID is required");
            res.status(400);
        }

        const send_emoji = await sendReaction(message_id, user_id, emoji);
        const populated_message = await populateMessage(send_emoji._id);
        console.log("populated --------------", populated_message)
        res.status(201).json(populated_message);
    } catch (error) {
        next(error);
    }
}