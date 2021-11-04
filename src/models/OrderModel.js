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
    full_name: {
        type: String,
        required: true,
    },
    shipping_region: {
        type: String,
        required: true,
    },
    shipping_address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "Payed",
    },
});

const orders = mongoose.model("orders", OrderSchema);
module.exports = orders;
