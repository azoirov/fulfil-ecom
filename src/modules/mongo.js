const mongoose = require("mongoose");
const { MONGO_URL, PORT } = require("../../config");

module.exports = async function mongo() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("DB connected");
    } catch (e) {
        console.log("DB connection refused");
    }
};
