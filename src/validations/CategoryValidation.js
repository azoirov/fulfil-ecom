const Joi = require("joi");

module.exports = function (data) {
    return Joi.object({
        category_name: Joi.string().required(),
    }).validateAsync(data);
};
