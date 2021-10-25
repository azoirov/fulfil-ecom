const bcrypt = require("bcrypt");

module.exports.generateHash = async (pass) => {
    let salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass, salt);
};

module.exports.compareHash = async (hash, pass) => {
    return await bcrypt.compare(pass, hash);
};
