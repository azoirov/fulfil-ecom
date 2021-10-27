const { checkJWTToken } = require("../modules/jwt");

module.exports = async function (req, res, next) {
    let token = req?.cookies?.token || req.headers["authorization"];

    token = checkJWTToken(token);

    if (!token) {
        res.redirect("/users/login");
        return;
    }

    req.user = token;

    next();
};
