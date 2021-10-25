const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    full_name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    is_verified: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const users = mongoose.model("users", UserSchema);
