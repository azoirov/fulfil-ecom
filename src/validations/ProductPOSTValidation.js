const Joi = require("joi");

module.exports = function (data) {
    return Joi.object({
        product_name: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().min(4).required(),
    }).validateAsync(data);
};
