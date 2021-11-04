const mongoose = require("mongoose");

const CommentLikeSchema = new mongoose.Schema({
    like_id: {
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

const comment_likes = mongoose.model("comment_likes", CommentLikeSchema);
module.exports = comment_likes;
