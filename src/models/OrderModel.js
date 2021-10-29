const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        unique: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
});

const orders = mongoose.model("orders", OrderSchema);
module.exports = orders;
