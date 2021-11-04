const Joi = require("joi");

module.exports = function (data) {
    return Joi.object({
        star: Joi.number().min(1).max(5).required(),
        text: Joi.string().required().min(5),
    }).validateAsync(data);
};
