import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import { createConversation, doesConversationExist, getUserConversations, populateConversation } from "../services/conversation.service.js";
import { findUser } from "../services/user.service.js";

export const create_open_conversation = async (req, res, next) => {
try {
    const sender_id = req.user.userId;
    const { receiver_id } = req.body;
    //check if receiver_id is provided
    if(!receiver_id){
        logger.error("Please provide the user Id you want to start a conversation with");
        throw createHttpError.BadRequest("Something went wrong");
    }
    //check if chat already exists
    const existed_conversation = await doesConversationExist(sender_id, receiver_id);
    if(existed_conversation){
        res.json(existed_conversation);
    }else{
        // let receiver_user = await findUser(receiver_id);
       let convoData = {
            name: "conversation name",
            picture: "conversation picture",
            isGroup: false,
            users: [sender_id, receiver_id],
       }
       const newConvo = await createConversation(convoData);
       const populatedConvo = await populateConversation(newConvo._id, "users", "-password")
       res.status(200).json(populatedConvo);
    }

} catch (error) {
    next(error);
}
}

export const getConversations = async (req, res, next)=> {
    try {
        const user_id = req.user.userId;
        const conversations = await getUserConversations(user_id);
        res.status(200).json(conversations);
    } catch (error) {
        next(error)
    }
}