import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema.Types;

const reactionSchema = mongoose.Schema({
    message_id: {
        type: ObjectId,
        ref: "MessageModel"
    },
    user: {
        type: ObjectId,
        ref: "UserModel"
    },
    emoji: {
        type: String,

    }
}, {
    collection: "reactions",
    timestamps: true,
});

const ReactionModel = mongoose.models.ReactionModel || mongoose.model('ReactionModel', reactionSchema);

export default ReactionModel;