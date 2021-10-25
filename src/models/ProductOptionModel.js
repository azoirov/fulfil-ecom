const mongoose = require("mongoose");

const ProductOptionSchema = new mongoose.Schema({
    product_option_id: {
        type: String,
        required: true,
        unique: true,
    },
    key: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    product_id: {
        type: String,
        required: true,
    },
});

const product_options = mongoose.model("product_options", ProductOptionSchema);
