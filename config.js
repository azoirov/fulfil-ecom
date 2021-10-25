require("dotenv").config();

const { env } = process;

module.exports = {
    PORT: env.PORT,
    MONGO_URL: env.MONGO_URL,
    SECRET_WORD: env.SECRET_WORD,
    EMAIL: env.EMAIL,
    PASS: env.PASS,
};
