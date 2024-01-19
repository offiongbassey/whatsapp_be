import { createConversation, doesConversationExist, getUserConversations, populateConversation, updateLatestMessage } from "../services/conversation.service.js";
import { createMessage, populateMessage } from "../services/message.service.js";
import { responseHandler } from "../helpers/responseHandler.js";
import { errorHandler } from "../helpers/errorHandler.js";

export const create_open_conversation = async (req, res, next) => {
try {
    const sender_id = req.user.userId;
    
    const { receiver_id, isGroup } = req.body;
    if(isGroup === false){
        //check if chat already exists
        const existed_conversation = await doesConversationExist(sender_id, receiver_id, false);
        if(existed_conversation){
            return responseHandler(res, 200, true, "Conversations", existed_conversation);
        }else{
            // let receiver_user = await findUser(receiver_id);
           let convoData = {
                name: "conversation name",
                picture: "conversation picture",
                isGroup: false,
                users: [sender_id, receiver_id],
           }
           const newConvo = await createConversation(convoData);
           const populatedConvo = await populateConversation(newConvo._id, "users", "-password");
           return responseHandler(res, 200, true, "Conversations", populatedConvo);
        }
    }else{
        //it's a group chat
        const existed_group_conversation = await doesConversationExist("", "", isGroup);
        return responseHandler(res, 200, true, "Conversation Group", existed_group_conversation);
    }

} catch (error) {
    await errorHandler(error);
    return responseHandler(res, 500, false, "Something went wrong, try again later", error);
}
}

export const getConversations = async (req, res, next)=> {
    try {
        const user_id = req.user.userId;
        const conversations = await getUserConversations(user_id);
        return responseHandler(res, 200, true, "Conversations", conversations);

    } catch (error) {
        await errorHandler(error);
        return responseHandler(res, 500, false, "Something went wrong, try again later", error);
    }
}

export const createGroup = async (req, res, next) => {
    try {
        const { name, users } = req.body;
        //add current user to users
        users.push(req.user.userId);
        if(users.length < 2){
            return responseHandler(res, 422, false, "Add atleast 2 users to the group chat", null);
        }
        let convoData = {
            name,
            users,
            isGroup: true,
            admin: req.user.userId,
            picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_kn25zrRwIl9PebM3BdHRLj5yfDKLqyJuHUcHvwuMO5brqets1IYGnqIVCq5cQFCYd74&usqp=CAU",
        }
        const newConvo = await createConversation(convoData);
        //create an empty message
        const message_data =
        {
            sender: req.user.userId,
            message: "",
            conversation: newConvo._id,
            files: [], 
        }
        const newMessage = await createMessage(message_data);
        const populatedConvo = await populateConversation(newConvo._id, 
            "users admin", 
            "-password")
        let populatedMessage = await populateMessage(newMessage._id);
        await updateLatestMessage(newConvo._id, newMessage);
        return responseHandler(res, 200, true, "Message populated", populatedMessage);

    } catch (error) {
       await errorHandler(error);
       return responseHandler(res, 500, false, "Something went wrong, try again later", error);
    }
}