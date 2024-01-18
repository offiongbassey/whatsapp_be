import { errorHandler } from "../helpers/errorHandler.js";
import { responseHandler } from "../helpers/responseHandler.js";
import { updateLatestMessage } from "../services/conversation.service.js";
import { createMessage, deleteUserMessage, editUserMessage, getConvoMessages, populateMessage, sendReaction } from "../services/message.service.js";

export const sendMessage = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const { message, convo_id, files } = req.body;
        if(!convo_id){
            return responseHandler(res, 422, false, "Please provide a conversaion Id and a message body.", null);
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
        return responseHandler(res, 201, true, "Message Sent", populatedMessage);

    } catch (error) {
       await errorHandler(error);
       return responseHandler(res, 500, false, "Something went wrong, try again later", error);
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
        return responseHandler(res, 200, true, "Message Retrieved", messages);
    } catch (error) {
        await errorHandler(error);
        return responseHandler(res, 500, false, "Something went wrong, try again later", error);
    }
}

export const deleteMessage = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const { message_id } = req.params;
        if(!message_id){
            return responseHandler(res, 422, false, "Message Id is required", null);
        }

        const delete_message = await deleteUserMessage(message_id, user_id);
        const populated_message = await populateMessage(delete_message._id);
        return responseHandler(res, 200, true, "Message Deleted", populated_message);
    } catch (error) {
        await errorHandler(error);
        return responseHandler(res, 500, false, "Something went wrong, try again later", error);
    }
}

export const editMessage = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const { message_id } = req.params;
        const { message } = req.body;

        if(!message_id){
            return responseHandler(res, 422, false, "Message Id is required", null);
        }

        const edit_message = await editUserMessage(message_id, user_id, message);
        const populated_message = await populateMessage(edit_message._id);
        console.log("Message editing...", populated_message);
        return responseHandler(res, 200, true, "Message Edited", populated_message);

    } catch (error) {
        await errorHandler(error);
        return responseHandler(res, 500, false, "Something went wrong, try again later", error);
    }
}

export const handleReaction = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const { message_id } = req.params;
        const { emoji } = req.body;

        if(!message_id){
            return responseHandler(res, 422, false, "Message Id is required", null);
        }

        const send_emoji = await sendReaction(message_id, user_id, emoji);
        const populated_message = await populateMessage(send_emoji._id);
        console.log("populated --------------", populated_message)
        
        return responseHandler(res, 200, true, "Reaction Sent", populated_message);
    } catch (error) {
        await errorHandler(error);
        return responseHandler(res, 500, false, "Something went wrong, try again later", error);
    }
}

export const replyMessage = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const { message, convo_id, files } = req.body;
        const { reply_id } = req.params;

        const message_data = {
            sender: user_id,
            message,
            conversation: convo_id,
            is_reply: true,
            message_replied: reply_id,
            replied_by: user_id,
            files: files || []
        }
        const send_reply = await createMessage(message_data);
        const populated_message = await populateMessage(send_reply._id);
        await updateLatestMessage(convo_id, send_reply)
        console.log("replying message -0------", populated_message);

        return responseHandler(res, 201, true, "Message Sent", populated_message);

    } catch (error) {
        await errorHandler();
        return responseHandler(res, 500, false, "Something went wrong, try again later", error);
    }
}