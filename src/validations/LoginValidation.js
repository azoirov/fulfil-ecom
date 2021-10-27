const Joi = require("joi");

module.exports = function (data) {
    return Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }).validateAsync(data);
};
