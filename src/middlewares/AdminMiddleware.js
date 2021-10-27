const { checkJWTToken } = require("../modules/jwt");

module.exports = async function (req, res, next) {
    let token = req?.cookies?.token || req.headers["authorization"];

    token = checkJWTToken(token);

    if (!token) {
        res.redirect("/users/login");
        return;
    }

    if (token.role === "user") {
        res.redirect("/");
        return;
    }

    req.admin = token;

    next();
};
