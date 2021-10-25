const router = require("express").Router();

router.post("/login");
router.post("/signup");

module.exports = {
    path: "/users",
    router,
};
