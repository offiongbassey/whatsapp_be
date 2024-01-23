import { client } from "../configs/redis.js";
import { errorHandler } from "../helpers/errorHandler.js";
import { responseHandler } from "../helpers/responseHandler.js";
import MessageModel from "../models/messageModel.js";
import { updateLatestMessage } from "../services/conversation.service.js";
import { createMessage, deleteUserMessage, editUserMessage, getConvoMessages, populateMessage, sendReaction } from "../services/message.service.js";

export const sendMessage = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const { message, convo_id, files } = req.body;
        const msgData = {
            sender: user_id,
            message,
            conversation: convo_id,
            files:  files || [],
        };
        let newMessage = await createMessage(msgData);
        let populatedMessage = await populateMessage(newMessage._id);
        await updateLatestMessage(convo_id, newMessage);

        // const all_messages = await getConvoMessages(convo_id);
        //sending message to redis
        // await client.set(`msg${ convo_id.toString() }`, JSON.stringify(all_messages));
        // const get_all_messages = await client.get(`msg${ convo_id.toString() }`, (err, data) => {
        //     if(err) return responseHandler(res, 400, false, "Something went wrong", err);
        // })

        return responseHandler(res, 201, true, "Message Sent", populatedMessage);
    } catch (error) {
       await errorHandler(error);
       return responseHandler(res, 500, false, "Something went wrong, try again later", error);
    }
}

export const  getMessages = async (req, res, next) => {
    try {
        const { convo_id } = req.params;
        const messages = await getConvoMessages(convo_id);
        //geting messages from redis
        // const message = await client.get(`msg${ convo_id.toString()}`, (err, data ) => {
        //     if(err) return responseHandler(res, 400, false, "Message not found", err);
        // });
        // console.log("Getting messages from redis -----------", JSON.parse(message));

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
       //check if message was sent by the user before deleting
        const message = await MessageModel.findOne({ _id: message_id, sender: user_id });
        if(!message){
            return responseHandler(res, 404, false, "Message not Identified", null);
        }

        const delete_message = await deleteUserMessage(message_id);
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
        //check if the user is the sender
        const msg = await MessageModel.findOne({ _id: message_id, sender: user_id });
        if(!msg){
            return responseHandler(res, 404, false, "Message Not found", null);
        }

        const edit_message = await editUserMessage(message_id, message);
        const populated_message = await populateMessage(edit_message._id);
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

        const send_emoji = await sendReaction(message_id, user_id, emoji);
        const populated_message = await populateMessage(send_emoji._id);
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
        return responseHandler(res, 201, true, "Message Sent", populated_message);

    } catch (error) {
        await errorHandler();
        return responseHandler(res, 500, false, "Something went wrong, try again later", error);
    }
}