const mongoose = require("mongoose");

const CommentDisLikeSchema = new mongoose.Schema({
    dislike_id: {
        type: String,
        required: true,
        unique: true,
    },
    comment_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
});

const comment_dislikes = mongoose.model(
    "comment_dislikes",
    CommentDisLikeSchema
);
module.exports = comment_dislikes;
