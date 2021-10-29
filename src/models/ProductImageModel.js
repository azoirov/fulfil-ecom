const mongoose = require("mongoose");

const ProductImageSchema = new mongoose.Schema({
    product_image_id: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        required: true,
    },
    product_id: {
        type: String,
        required: true,
    },
});

const product_images = mongoose.model("product_images", ProductImageSchema);
module.exports = product_images;
