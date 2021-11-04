const Joi = require("joi");

module.exports = function (data) {
    return Joi.object({
        full_name: Joi.string().required(),
        shipping_region: Joi.string().required(),
        shipping_address: Joi.string().required(),
        comment: Joi.string(),
        phone: Joi.number().required(),
    }).validateAsync(data);
};
