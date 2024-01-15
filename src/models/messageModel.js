import mongoose from "mongoose";

const {ObjectId } = mongoose.Schema.Types;

const messageSchema = mongoose.Schema({
    sender: {
        type: ObjectId,
        ref: "UserModel",
    },
    message: {
        type: String,
        trim: true,
    },
    conversation: {
        type: ObjectId,
        ref: "ConversationModel",
    },
    status: {
        type: String,
        default: "active"
    },
    editedStatus: {
        type: Boolean,
        default: false
    },
    reaction: [
        {   user: {
                type: ObjectId,
                ref: "UserModel"
            },
            emoji: {
                type: String
            }
        }
    ],
    is_reply:{
        type: Boolean,
        default: false
    },
    message_replied: {
        type: ObjectId,
        ref: "MessageModel",
        default: null
    },
    replied_by: {
        type: ObjectId,
        ref: "UserModel",
        default: null
    },
    files: [],
}, {
    collection: "messages", 
    timestamps: true,
});

const MessageModel = mongoose.models.MessageModel || mongoose.model('MessageModel', messageSchema);

export default MessageModel;