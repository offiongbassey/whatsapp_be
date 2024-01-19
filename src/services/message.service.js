import createHttpError from "http-errors";
import { MessageModel } from "../models/index.js"

export const createMessage = async (data) => {
    let newMessage = await MessageModel.create(data);
    return newMessage;
}

export const populateMessage = async(id) => {
    let msg = await MessageModel.findById(id)
    .populate({
        path: 'sender',
        select: "name picture",
        model: "UserModel",
    })
    .populate({
        path: "reaction.user",
        select: "name picture _id",
        model: "UserModel"
        
    })
    .populate({
        path: "message_replied",
        select: "message",
        model: "MessageModel"
    })
    .populate({
        path: 'conversation',
        select: 'name picture isGroup users',
        model: "ConversationModel",
        populate: {
            path: "users",
            select: "name email picture status",
            model: "UserModel",
        }
    });
    return msg;
}

export const getConvoMessages = async (convo_id) => {
    const messages = await MessageModel.find({ conversation: convo_id})
    .populate("sender", "name picture email status")
    .populate({
        path: "reaction.user",
        select: "name picture _id",
        model: "UserModel"
    })
    .populate({
        path: "message_replied",
        select: "message _id",
        model: "MessageModel"
    })
    .populate("conversation");
    return messages;
}

export const deleteUserMessage = async (message_id ) => {
    
    const soft_del_message = await MessageModel.findByIdAndUpdate({ _id: message_id }, { status: "deleted"  });
    soft_del_message.status = "deleted";
    return soft_del_message;

}

export const editUserMessage = async (message_id, message) => {
    
    const updated_message = await MessageModel.findByIdAndUpdate({ _id: message_id }, { message, editedStatus: true });
    return updated_message;
}

export const sendReaction = async (message_id, user_id, emoji) => {
    const msg = await MessageModel.findOne({ _id: message_id });
    
    //verifying if this user already has a reaction on this message
    let check = false;
    let existing_emoji;
    let add_emoji;
    msg.reaction.forEach((react) => {
        if(react.user == user_id){
            check = true;
            existing_emoji = react.emoji;
        }
    });
    //if the user has a reaction already, then update the reaction
    if(check === true){
    add_emoji = await MessageModel.findOneAndUpdate({
        '_id': message_id,
        reaction: {
            $elemMatch: {
                user: user_id
            }
        }
    }, {
        $set: {
                "reaction.$[s].user": user_id,
                "reaction.$[s].emoji": existing_emoji === emoji ? "" : emoji
        }
    }, {
        'arrayFilters': [
            { "s.user": user_id }
        ],
        'new': true,
        'safe': true
    });

    //othewise create add new reaction to the message
    }else{
    add_emoji = await MessageModel.findOneAndUpdate(
        { _id: message_id}, 
        {$push: {"reaction": {
            user: user_id,
            emoji
        }}}, 
        { new: true }
    );
    }
    
    return add_emoji;
}