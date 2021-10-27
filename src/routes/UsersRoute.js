const {
    SignUpController,
    VerifyEmailController,
    LoginController,
} = require("../controllers/UsersController");

const router = require("express").Router();

router.post("/login", LoginController);
router.post("/signup", SignUpController);
router.get("/verify/:user_id", VerifyEmailController);

module.exports = {
    path: "/users",
    router,
};
