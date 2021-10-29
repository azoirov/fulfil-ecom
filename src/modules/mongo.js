const mongoose = require("mongoose");
const { MONGO_URL, PORT } = require("../../config");

require("../models/UserModel");
require("../models/CartModel");
require("../models/CategoryModel");
require("../models/CommentModel");
require("../models/OrderModel");
require("../models/OrderItemModel");
require("../models/ProductModel");
require("../models/ProductOptionModel");
require("../models/ProductImageModel");

module.exports = async function mongo() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("DB connected");
    } catch (e) {
        console.log("DB connection refused");
    }
};
