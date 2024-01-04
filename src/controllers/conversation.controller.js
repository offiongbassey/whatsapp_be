import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import { createConversation, doesConversationExist, getUserConversations, populateConversation } from "../services/conversation.service.js";
import { findUser } from "../services/user.service.js";

export const create_open_conversation = async (req, res, next) => {
try {
    const sender_id = req.user.userId;
    const { receiver_id, isGroup } = req.body;
    //check if receiver_id is provided
    if(isGroup === false){
        if(!receiver_id){
            logger.error("Please provide the user Id you want to start a conversation with");
            throw createHttpError.BadRequest("Something went wrong");
        }
        //check if chat already exists
        const existed_conversation = await doesConversationExist(sender_id, receiver_id, false);
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
    }else{
        //it's a group chat
        const existed_group_conversation = await doesConversationExist("", "", isGroup);
        res.status(200).json(existed_group_conversation);
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

export const createGroup = async (req, res, nexth) => {
    try {
        const { name, users } = req.body;
        //add current user to users
       
        if(! name || !users) {
            throw createHttpError.BadRequest("Please fill all fields.");
        }
        users.push(req.user.userId);
        if(users.length < 2){
            throw createHttpError.BadRequest("Add atleast 2 users to the group chat");
        }
        let convoData = {
            name,
            users,
            isGroup: true,
            admin: req.user.userId,
            picture: "https://play-lh.googleusercontent.com/zDqzqDw8_y5z_TYIWJaZ6etvqn9lOvkSaM4LZXBqcnziLh0lGSN9psLkXqwvThS4Nw",

        }
        const newConvo = await createConversation(convoData);
        const populatedConvo = await populateConversation(newConvo._id, 
            "users admin", 
            "-password")
            console.log(populatedConvo);
            res.status(200).json(populatedConvo);

    } catch (error) {
        next(error);
    }
}