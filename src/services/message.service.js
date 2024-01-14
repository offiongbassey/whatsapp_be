import createHttpError from "http-errors";
import { MessageModel } from "../models/index.js"

export const createMessage = async (data) => {
    let newMessage = await MessageModel.create(data);
    if(!newMessage) throw createHttpError.BadRequest("Oops.... Something went wrong")
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
        path: 'conversation',
        select: 'name picture isGroup users',
        model: "ConversationModel",
        populate: {
            path: "users",
            select: "name email picture status",
            model: "UserModel",
        }
    });
    if(!msg) throw createHttpError.BadRequest("Oops... Something went wrong");
    return msg;
}

export const getConvoMessages = async (convo_id) => {
    const messages = await MessageModel.find({ conversation: convo_id})
    .populate("sender", "name picture email status")
    .populate("conversation");
    if(!messages) throw  createHttpError.BadRequest("Oops.. Something went wrong");
    return messages;
}

export const deleteUserMessage = async (message_id, user_id ) => {
    const message = await MessageModel.findOne({ _id: message_id, sender: user_id });
    if(!message){
        throw createHttpError.BadRequest("Unauthorized Action");
    }
    const soft_del_message = await MessageModel.findByIdAndUpdate({ _id: message_id }, { status: "deleted"  });
    soft_del_message.status = "deleted";
    return soft_del_message;

}

export const editUserMessage = async (message_id, user_id, message) => {
    const msg = await MessageModel.findOne({ _id: message_id, sender: user_id });
    if(!msg){
        throw createHttpError.BadRequest("Unathorized User");
    }
    const updated_message = await MessageModel.findByIdAndUpdate({ _id: message_id }, { message, editedStatus: true });
    return updated_message;
}