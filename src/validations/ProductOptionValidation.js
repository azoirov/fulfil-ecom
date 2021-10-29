const Joi = require("joi");

module.exports = function (data) {
    return Joi.object({
        key: Joi.string().required(),
        value: Joi.string().required(),
    }).validateAsync(data);
};
